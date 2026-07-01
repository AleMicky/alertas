import { BadRequestException, Injectable } from '@nestjs/common';

import { EventMapper } from 'src/app/mappers/event.mapper';
import { normalizeRecipientPayload } from 'src/app/utils/normalize-recipient-payload.util';
import { BaseService } from 'src/shared/core/base.service';
import { ClientSystem } from 'src/domain/entities/client-system';
import { Event } from 'src/domain/entities/event';
import { EventRepository } from 'src/domain/repositories/event.repository';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';
import { EventRecipient } from 'src/domain/types/event-payload.type';
import { CreateEventDto } from 'src/presentation/dto/event/create-event.dto';
import { ResponseEventDto } from 'src/presentation/dto/event/response-event.dto';
import { AlertService } from './alert.service';

@Injectable()
export class EventService extends BaseService<Event> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly notificationChannelRepository: NotificationChannelRepository,
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

    const normalizedPayload = await this.normalizePayload(
      dto.payloadJson,
      dto.reference,
    );

    const partial = this.eventMapper.fromCreateDto({
      ...dto,
      payloadJson: normalizedPayload,
    });

    const event = await this.eventRepository.create({
      ...partial,
      clientSystem,
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

  private async normalizePayload(
    payload: Record<string, unknown> | undefined,
    reference?: string,
  ): Promise<Record<string, unknown>> {
    const rawRecipients = payload?.recipients;

    if (rawRecipients !== undefined && !Array.isArray(rawRecipients)) {
      throw new BadRequestException('payloadJson.recipients debe ser un arreglo');
    }

    const recipients = Array.isArray(rawRecipients) ? rawRecipients : [];
    const normalizedRecipients: EventRecipient[] = [];

    for (let index = 0; index < recipients.length; index++) {
      const rawRecipient = recipients[index];

      if (
        !rawRecipient ||
        typeof rawRecipient !== 'object' ||
        Array.isArray(rawRecipient)
      ) {
        throw new BadRequestException(
          `payloadJson.recipients[${index}] debe ser un objeto`,
        );
      }

      const recipient = rawRecipient as Record<string, unknown>;
      const channelCode = recipient.channel;

      if (typeof channelCode !== 'string' || !channelCode.trim()) {
        throw new BadRequestException(
          `payloadJson.recipients[${index}].channel es requerido`,
        );
      }

      const channel =
        await this.notificationChannelRepository.findByRecipientChannel(
          channelCode,
        );

      if (!channel) {
        throw new BadRequestException(
          `Canal de notificación no encontrado: ${channelCode}`,
        );
      }

      if (!channel.active) {
        throw new BadRequestException(
          `Canal de notificación inactivo: ${channelCode}`,
        );
      }

      normalizedRecipients.push(
        normalizeRecipientPayload(recipient, channel, index),
      );
    }

    const { recipients: _recipients, metadata: rawMetadata, ...rest } =
      payload ?? {};

    const metadata = this.normalizeMetadata(rawMetadata, reference);

    return {
      ...rest,
      metadata,
      recipients: normalizedRecipients,
    };
  }

  private normalizeMetadata(
    rawMetadata: unknown,
    reference?: string,
  ): Record<string, unknown> {
    if (
      rawMetadata !== undefined &&
      (typeof rawMetadata !== 'object' ||
        rawMetadata === null ||
        Array.isArray(rawMetadata))
    ) {
      throw new BadRequestException('payloadJson.metadata debe ser un objeto');
    }

    const metadata = {
      ...((rawMetadata as Record<string, unknown> | undefined) ?? {}),
    };

    if (reference?.trim()) {
      metadata.reference = reference.trim();
    }

    return metadata;
  }
}
