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

import { AlertNotificationRepository } from 'src/domain/repositories/alert-notification.repository';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';
import {
  isRecipientTargetValid,
  resolveRecipientTarget,
} from 'src/app/utils/resolve-recipient-target.util';

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

      if (!isRecipientTargetValid(recipient)) {
        this.logger.warn(
          `Recipient omitido: destino inválido para canal ${recipient.channel}`,
        );
        continue;
      }

      const notificationChannel =
        await this.notificationChannelRepository.findByRecipientChannel(
          recipient.channel,
        );

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

      const notification = await this.alertNotificationRepository.create({
        alert,
        notificationChannel,
        target: resolveRecipientTarget(recipient)!,
        title: recipient.subject ?? alert.title,
        message: recipient.message ?? alert.message,
        payloadJson: this.cleanRecipientPayload(recipient),
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

  private cleanRecipientPayload(
    recipient: EventRecipient,
  ): Record<string, unknown> {
    const { channel, ...payload } = recipient;
    return payload;
  }

  findByAlertId(alertId: string) {
    return this.alertNotificationRepository.findByAlertId(alertId);
  }

  findByStatus(status: AlertNotificationStatus) {
    return this.alertNotificationRepository.findByStatus(status);
  }
}
