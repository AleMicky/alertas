import { Injectable } from '@nestjs/common';

import { Alert } from 'src/domain/entities/alert';
import { AlertStatus } from 'src/domain/enums/alert-status.enum';
import { EventMapper } from 'src/app/mappers/event.mapper';
import {
  AlertNotificationStatsDto,
  ResponseAlertDto,
} from 'src/presentation/dto/alert/response-alert.dto';

@Injectable()
export class AlertMapper {
  constructor(private readonly eventMapper: EventMapper) {}

  toResponse(
    entity: Alert,
    notifications: AlertNotificationStatsDto = {
      total: 0,
      sent: 0,
      failed: 0,
      pending: 0,
    },
  ): ResponseAlertDto {
    const attendedAt = entity.notifiedAt ?? entity.failedAt ?? undefined;

    return {
      id: entity.id,
      eventId: entity.event.id,
      event: this.eventMapper.toResponse(entity.event),
      status: entity.status,
      title: this.buildTitle(entity),
      message: this.buildMessage(entity),
      reference: this.getEventReference(entity),
      alertDate: entity.createdAt.toISOString(),
      attendedAt: attendedAt?.toISOString(),
      notifiedAt: entity.notifiedAt?.toISOString() ?? undefined,
      failedAt: entity.failedAt?.toISOString() ?? undefined,
      active: entity.status === AlertStatus.OPEN,
      notifications,
    };
  }

  private buildTitle(alert: Alert): string {
    const eventType =
      alert.event?.eventType?.name ?? alert.event?.eventType?.code ?? 'Alerta';
    const reference = this.getEventReference(alert);

    return reference ? `${eventType} · ${reference}` : eventType;
  }

  private buildMessage(alert: Alert): string {
    const client = alert.event?.clientSystem?.name ?? alert.event?.clientSystem?.code;
    const eventType =
      alert.event?.eventType?.name ?? alert.event?.eventType?.code;

    if (client && eventType) {
      return `Alerta ${alert.status.toLowerCase()} · ${eventType} desde ${client}`;
    }

    if (eventType) {
      return `Alerta ${alert.status.toLowerCase()} por evento ${eventType}`;
    }

    return `Alerta operativa · ${alert.status}`;
  }

  private getEventReference(alert: Alert): string | undefined {
    const metadata = alert.event?.payloadJson?.metadata;

    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      return undefined;
    }

    const reference = (metadata as Record<string, unknown>).reference;

    return typeof reference === 'string' && reference.trim()
      ? reference.trim()
      : undefined;
  }
}
