import { Injectable } from '@nestjs/common';

import { Alert } from 'src/domain/entities/alert';
import { AlertNotification } from 'src/domain/entities/alert-notification';
import { ResponseAlertNotificationDto } from 'src/presentation/dto/alert-notification/response-alert-notification.dto';

@Injectable()
export class AlertNotificationMapper {
  toResponse(entity: AlertNotification): ResponseAlertNotificationDto {
    const alert = entity.alert;

    return {
      id: entity.id,
      alert: this.toAlertRef(alert),
      alertId: alert.id,
      notificationChannel: {
        id: entity.notificationChannel.id,
        code: entity.notificationChannel.code,
        name: entity.notificationChannel.name,
      },
      notificationChannelId: entity.notificationChannel.id,
      target: entity.target ?? '',
      title: this.buildTitle(entity),
      message: this.buildMessage(entity),
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      sentAt: entity.sentAt?.toISOString(),
      payloadJson: entity.payloadJson,
      responseJson: entity.responseJson,
      errorMessage: entity.errorMessage,
    };
  }

  private toAlertRef(alert: Alert): ResponseAlertNotificationDto['alert'] {
    return {
      id: alert.id,
      status: alert.status,
      title: this.buildAlertTitle(alert),
      message: this.buildAlertMessage(alert),
      alertDate: alert.createdAt.toISOString(),
    };
  }

  private buildAlertTitle(alert: Alert): string {
    const eventType = alert.event?.eventTypeCode ?? 'Alerta';
    const reference = this.getEventReference(alert);

    return reference ? `${eventType} · ${reference}` : eventType;
  }

  private buildAlertMessage(alert: Alert): string {
    const eventType = alert.event?.eventTypeCode;

    if (eventType) {
      return `Alerta generada por evento ${eventType}`;
    }

    return 'Alerta operativa';
  }

  private buildTitle(notification: AlertNotification): string {
    const channel =
      notification.notificationChannel?.name
      ?? notification.notificationChannel?.code
      ?? 'Canal';

    return `${channel} → ${notification.target ?? 'sin destino'}`;
  }

  private buildMessage(notification: AlertNotification): string {
    const payload = notification.payloadJson;

    if (payload) {
      for (const key of ['subject', 'body', 'message', 'text']) {
        const value = payload[key];

        if (typeof value === 'string' && value.trim()) {
          return value.trim();
        }
      }
    }

    const eventType = notification.alert?.event?.eventTypeCode;

    if (eventType) {
      return `Entrega para ${eventType}`;
    }

    return notification.target ?? 'Notificación de alerta';
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
