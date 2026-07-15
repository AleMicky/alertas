import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  N8nClient,
  N8nNotificationPayload,
} from 'src/infrastructure/integrations/n8n/n8n.client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly n8nClient: N8nClient,
    private readonly configService: ConfigService,
  ) {}

  sendToN8n(payload: N8nNotificationPayload) {
    const webhookUrl = this.configService.get<string>('N8N_WEBHOOK_TEST_URL');

    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_TEST_URL no configurada');
    }

    return this.n8nClient.sendNotification(webhookUrl, payload);
  }
}
