import { ConfigService } from '@nestjs/config';

import { getNotificationChannelKind } from './normalize-notification-channel.util';

const WEBHOOK_PATH_BY_KIND: Partial<
  Record<
    ReturnType<typeof getNotificationChannelKind>,
    string
  >
> = {
  TELEGRAM: 'telegram',
  EMAIL: 'send-email',
  WHATSAPP: 'whatsapp',
  TEAMS: 'teams',
};

export function resolveChannelWebhookUrl(
  channelCode: string,
  configService: ConfigService,
): string {
  const normalizedCode = channelCode
    .replace(/[^A-Za-z0-9_]/g, '_')
    .toUpperCase();
  const specificUrl = configService.get<string>(
    `N8N_WEBHOOK_${normalizedCode}_URL`,
  );

  if (specificUrl?.trim()) {
    return specificUrl.trim();
  }

  const directUrl = configService.get<string>('N8N_WEBHOOK_URL');

  if (directUrl?.trim()) {
    return directUrl.trim();
  }

  const baseUrl = configService.get<string>('N8N_WEBHOOK_BASE_URL');

  if (!baseUrl?.trim()) {
    throw new Error(
      `Webhook no configurado para el canal ${channelCode}. Define N8N_WEBHOOK_URL, N8N_WEBHOOK_BASE_URL o N8N_WEBHOOK_${normalizedCode}_URL`,
    );
  }

  const kind = getNotificationChannelKind(channelCode);
  const path = WEBHOOK_PATH_BY_KIND[kind] ?? channelCode.toLowerCase();

  return `${baseUrl.replace(/\/$/, '')}/webhook/${path}`;
}
