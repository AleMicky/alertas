import { Injectable } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';

export interface N8nNotificationPayload extends Record<string, unknown> {
  notificationId: string;
  alertId?: string;
  eventId?: string;
  channel: string;
  target: string;
  title: string;
  message: string;
  payload: Record<string, unknown>;
}

export type SendNotificationOptions = {
  headers?: Record<string, string>;
  timeoutMs?: number;
};

@Injectable()
export class N8nClient {
  async sendNotification(
    webhookUrl: string,
    body: N8nNotificationPayload | Record<string, unknown>,
    options?: SendNotificationOptions,
  ): Promise<unknown> {
    if (!webhookUrl) {
      throw new Error('Webhook URL no configurada');
    }

    try {
      const response = await axios.post(webhookUrl, body, {
        timeout: options?.timeoutMs ?? 30000,
        headers: options?.headers,
        validateStatus: (status) => status >= 200 && status < 300,
      });

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        const detail =
          typeof data === 'string' ? data : JSON.stringify(data ?? {});

        throw new Error(`n8n respondió ${status}: ${detail}`);
      }

      throw error;
    }
  }
}
