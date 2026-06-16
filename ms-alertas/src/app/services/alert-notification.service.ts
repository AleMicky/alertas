import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { BaseService } from 'src/shared/core/base.service';
import { Alert } from 'src/domain/entities/alert';
import { AlertNotification } from 'src/domain/entities/alert-notification';
import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';
import {
  EventPayload,
  EventRecipient,
} from 'src/domain/types/event-payload.type';

import { buildAlertNotificationPayload } from 'src/app/utils/build-alert-notification-payload.util';
import { AlertNotificationRepository } from 'src/domain/repositories/alert-notification.repository';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';

@Injectable()
export class AlertNotificationService extends BaseService<AlertNotification> {
  private readonly logger = new Logger(AlertNotificationService.name);

  constructor(
    private readonly alertNotificationRepository: AlertNotificationRepository,
    private readonly notificationChannelRepository: NotificationChannelRepository,
    @InjectQueue('alert-notifications')
    private readonly alertNotificationQueue: Queue,
  ) {
    super(alertNotificationRepository);
  }

  async createFromAlert(alert: Alert): Promise<AlertNotification[]> {
    const eventPayload = (alert.event.payloadJson ?? {}) as EventPayload;
    const recipients = eventPayload.recipients ?? [];
    const notifications: AlertNotification[] = [];
    const jobs: Array<{ alertNotificationId: string }> = [];

    for (const recipient of recipients) {
      if (!recipient?.channel) {
        this.logger.warn('Recipient omitido: falta channel');
        continue;
      }

      const notificationChannel =
        await this.notificationChannelRepository.findByCode(recipient.channel);

      if (!notificationChannel) {
        this.logger.warn(
          `Recipient omitido: canal no encontrado (${recipient.channel})`,
        );
        continue;
      }

      if (!notificationChannel.active) {
        this.logger.warn(
          `Recipient omitido: canal inactivo (${recipient.channel})`,
        );
        continue;
      }

      let target: string;
      let payloadJson: Record<string, unknown>;

      try {
        ({ target, payloadJson } = buildAlertNotificationPayload(
          recipient,
          notificationChannel,
        ));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Recipient omitido para canal ${recipient.channel}: ${message}`,
        );
        continue;
      }

      const notification = await this.alertNotificationRepository.create({
        alert,
        notificationChannel,
        target,
        payloadJson,
        status: AlertNotificationStatus.PENDING,
      });

      notifications.push(notification);
      jobs.push({ alertNotificationId: notification.id });
    }

    for (const job of jobs) {
      await this.alertNotificationQueue.add('send-alert-notification', job, {
        jobId: job.alertNotificationId,
      });
    }

    return notifications;
  }

  findByAlertId(alertId: string) {
    return this.alertNotificationRepository.findByAlertId(alertId);
  }

  findByStatus(status: AlertNotificationStatus) {
    return this.alertNotificationRepository.findByStatus(status);
  }
}
