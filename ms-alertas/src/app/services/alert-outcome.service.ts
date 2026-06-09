import { Injectable, Logger } from '@nestjs/common';

import { Alert } from 'src/domain/entities/alert';
import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';
import { AlertStatus } from 'src/domain/enums/alert-status.enum';
import { EventStatus } from 'src/domain/enums/event-status.enum';
import { AlertNotificationRepository } from 'src/domain/repositories/alert-notification.repository';
import { AlertRepository } from 'src/domain/repositories/alert.repository';
import { EventRepository } from 'src/domain/repositories/event.repository';

@Injectable()
export class AlertOutcomeService {
  private readonly logger = new Logger(AlertOutcomeService.name);

  constructor(
    private readonly alertNotificationRepository: AlertNotificationRepository,
    private readonly alertRepository: AlertRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async syncFromNotifications(alertId: string): Promise<void> {
    const notifications =
      await this.alertNotificationRepository.findByAlertId(alertId);

    if (notifications.length === 0) {
      return;
    }

    const statuses = notifications.map((n) => n.status);
    const hasInProgress = statuses.some(
      (s) =>
        s === AlertNotificationStatus.PENDING ||
        s === AlertNotificationStatus.PROCESSING,
    );

    if (hasInProgress) {
      return;
    }

    const eventId = notifications[0].alert.event.id;
    const allSent = statuses.every((s) => s === AlertNotificationStatus.SENT);
    const allFailed = statuses.every(
      (s) => s === AlertNotificationStatus.FAILED,
    );
    const anySent = statuses.some((s) => s === AlertNotificationStatus.SENT);
    const processedAt = new Date();

    if (allSent) {
      await this.alertRepository.update(alertId, {
        status: AlertStatus.NOTIFIED,
      });
      await this.eventRepository.update(eventId, {
        status: EventStatus.PROCESSED,
        processedAt,
      });
      this.logger.log(
        `Alerta ${alertId} y evento ${eventId} completados (todas las notificaciones enviadas)`,
      );
      return;
    }

    if (allFailed) {
      await this.alertRepository.update(alertId, {
        status: AlertStatus.FAILED,
      });
      await this.eventRepository.update(eventId, {
        status: EventStatus.FAILED,
        processedAt,
      });
      this.logger.warn(
        `Alerta ${alertId} y evento ${eventId} fallidos (ninguna notificación enviada)`,
      );
      return;
    }

    await this.alertRepository.update(alertId, {
      status: anySent ? AlertStatus.NOTIFIED : AlertStatus.FAILED,
    });
    await this.eventRepository.update(eventId, {
      status: EventStatus.FAILED,
      processedAt,
    });
    this.logger.warn(
      `Alerta ${alertId} con resultado parcial (${statuses.join(', ')})`,
    );
  }

  async markNoRecipients(alert: Alert): Promise<void> {
    await this.alertRepository.update(alert.id, {
      status: AlertStatus.FAILED,
    });
    await this.eventRepository.update(alert.event.id, {
      status: EventStatus.FAILED,
      processedAt: new Date(),
    });
    this.logger.warn(
      `Sin destinatarios válidos para la alerta ${alert.id} (evento ${alert.event.id})`,
    );
  }
}
