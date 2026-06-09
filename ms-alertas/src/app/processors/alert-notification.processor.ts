import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { getNotificationChannelKind } from 'src/app/utils/normalize-notification-channel.util';
import { AlertNotificationService } from 'src/app/services/alert-notification.service';
import { AlertOutcomeService } from 'src/app/services/alert-outcome.service';
import { N8nClient } from 'src/infrastructure/integrations/n8n/n8n.client';
import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';

@Processor('alert-notifications')
@Injectable()
export class AlertNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertNotificationProcessor.name);

  constructor(
    private readonly alertNotificationService: AlertNotificationService,
    private readonly alertOutcomeService: AlertOutcomeService,
    private readonly n8nClient: N8nClient,
  ) {
    super();
  }

  async process(
    job: Job<{
      alertNotificationId: string;
    }>,
  ): Promise<void> {
    const { alertNotificationId } = job.data;

    const notification =
      await this.alertNotificationService.findOne(alertNotificationId);

    if (!notification) {
      this.logger.warn(`Notificación no encontrada: ${alertNotificationId}`);
      return;
    }

    if (notification.status === AlertNotificationStatus.SENT) {
      this.logger.log(`Notificación ya enviada, se omite: ${notification.id}`);
      return;
    }

    const alertId = notification.alert.id;

    try {
      await this.alertNotificationService.update(notification.id, {
        status: AlertNotificationStatus.PROCESSING,
      });

      const webhookUrl = notification.notificationChannel.webhookUrl;

      if (!webhookUrl) {
        throw new Error(
          `Webhook URL no configurada para el canal ${notification.notificationChannel.code}`,
        );
      }

      const channelCode = notification.notificationChannel.code;
      const channelKind = getNotificationChannelKind(channelCode);
      const n8nChannel =
        channelKind === 'GENERIC' ? channelCode : channelKind;

      const response = await this.n8nClient.sendNotification(webhookUrl, {
        notificationId: notification.id,
        channel: n8nChannel,
        target: notification.target,
        title: notification.title,
        message: notification.message,
        payload: notification.payloadJson ?? {},
      });

      await this.alertNotificationService.update(notification.id, {
        status: AlertNotificationStatus.SENT,
        sentAt: new Date(),
        responseJson: response as Record<string, unknown>,
      });

      await this.alertOutcomeService.syncFromNotifications(alertId);

      this.logger.log(`Notificación enviada: ${notification.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      await this.alertNotificationService.update(notification.id, {
        status: AlertNotificationStatus.FAILED,
        errorMessage,
      });

      await this.alertOutcomeService.syncFromNotifications(alertId);

      this.logger.error(
        `Error enviando notificación: ${notification.id}`,
        errorMessage,
      );

      throw error;
    }
  }
}
