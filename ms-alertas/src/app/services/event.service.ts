import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { BaseService } from 'src/shared/core/base.service';
import { ClientSystem } from 'src/domain/entities/client-system';
import { Event } from 'src/domain/entities/event';
import { EventRepository } from 'src/domain/repositories/event.repository';
import { EventTypeRepository } from 'src/domain/repositories/event-type.repository';
import { CreateEventDto } from 'src/presentation/dto/event/create-event.dto';
import { EventStatus } from 'src/domain/enums/event-status.enum';
import { normalizeEventPayload } from 'src/app/utils/normalize-event-payload.util';

import { AlertService } from './alert.service';

@Injectable()
export class EventService extends BaseService<Event> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventTypeRepository: EventTypeRepository,
    private readonly alertService: AlertService,
  ) {
    super(eventRepository);
  }

  async createFromDto(
    dto: CreateEventDto,
    authenticatedClientSystem: ClientSystem,
  ): Promise<Event> {
    if (
      dto.clientSystemCode &&
      dto.clientSystemCode !== authenticatedClientSystem.code
    ) {
      throw new BadRequestException(
        'El código de sistema cliente no coincide con el token',
      );
    }

    const clientSystem = authenticatedClientSystem;

    const eventType = await this.eventTypeRepository.findByCode(
      clientSystem.id,
      dto.eventTypeCode,
    );

    if (!eventType) {
      throw new BadRequestException('Tipo de evento no encontrado');
    }

    if (!eventType.severityLevel) {
      throw new BadRequestException(
        'El tipo de evento no tiene severidad configurada',
      );
    }

    const { title, message, payloadJson } = normalizeEventPayload(
      dto.payloadJson,
      eventType,
      dto.title,
      dto.message,
    );

    const event = await this.eventRepository.create({
      clientSystem,
      code: this.generateEventCode(),
      eventType: dto.eventTypeCode,
      title,
      message,
      payloadJson,
      status: EventStatus.PENDING,
      eventDate: new Date(),
      active: dto.active ?? true,
    });

    await this.alertService.createFromEvent(event);

    return event;
  }

  findByCode(code: string) {
    return this.eventRepository.findByCode(code);
  }

  findByClientSystemId(clientSystemId: string) {
    return this.eventRepository.findByClientSystemId(clientSystemId);
  }

  private generateEventCode(): string {
    return `EVT-${randomUUID()}`;
  }
}
