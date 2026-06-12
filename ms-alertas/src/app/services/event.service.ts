import { BadRequestException, Injectable } from '@nestjs/common';

import { EventMapper } from 'src/app/mappers/event.mapper';
import { BaseService } from 'src/shared/core/base.service';
import { ClientSystem } from 'src/domain/entities/client-system';
import { Event } from 'src/domain/entities/event';
import { EventRepository } from 'src/domain/repositories/event.repository';
import { EventTypeRepository } from 'src/domain/repositories/event-type.repository';
import { CreateEventDto } from 'src/presentation/dto/event/create-event.dto';
import { ResponseEventDto } from 'src/presentation/dto/event/response-event.dto';
import { AlertService } from './alert.service';

type EventPayload = {
  metadata: Record<string, unknown>;
  recipients: Record<string, unknown>[];
};

@Injectable()
export class EventService extends BaseService<Event> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventTypeRepository: EventTypeRepository,
    private readonly eventMapper: EventMapper,
    private readonly alertService: AlertService,
  ) {
    super(eventRepository);
  }

  async createFromDto(
    dto: CreateEventDto,
    authenticatedClientSystem: ClientSystem,
  ): Promise<ResponseEventDto> {
    const clientSystem = authenticatedClientSystem;

    const eventType = await this.eventTypeRepository.findByCode(
      clientSystem.id,
      dto.eventTypeCode,
    );

    if (!eventType) {
      throw new BadRequestException('Tipo de evento no encontrado');
    }

    const normalizedPayload = this.normalizePayload(dto.payloadJson);

    const partial = this.eventMapper.fromCreateDto({
      ...dto,
      payloadJson: normalizedPayload,
    });

    const event = await this.eventRepository.create({
      ...partial,
      clientSystem,
      eventType,
    });

     await this.alertService.createFromEvent(event);

    return this.eventMapper.toResponse(event);
  }

  async findByClientSystemId(clientSystemId: string): Promise<ResponseEventDto[]> {
    const events =
      await this.eventRepository.findByClientSystemId(clientSystemId);

    return events.map((event) => this.eventMapper.toResponse(event));
  }

  async findAllMapped(): Promise<ResponseEventDto[]> {
    const events = await this.eventRepository.findAll();

    return events.map((event) => this.eventMapper.toResponse(event));
  }

  async findOneMapped(id: string): Promise<ResponseEventDto | null> {
    const event = await this.eventRepository.findOne(id);
    return event ? this.eventMapper.toResponse(event) : null;
  }

  async updateMapped(
    id: string,
    dto: Parameters<EventMapper['fromUpdateDto']>[0],
  ): Promise<ResponseEventDto> {
    const partial = this.eventMapper.fromUpdateDto(dto);
    const event = await this.eventRepository.update(id, partial);

    return this.eventMapper.toResponse(event);
  }

  private normalizePayload(payload?: Record<string, any>): EventPayload {
    return {
      metadata: payload?.metadata ?? {},
      recipients: Array.isArray(payload?.recipients)
        ? payload.recipients
        : [],
    };

  }

}
