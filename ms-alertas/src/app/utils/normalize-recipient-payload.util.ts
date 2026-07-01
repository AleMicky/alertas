import { BadRequestException } from '@nestjs/common';

import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { EventRecipient } from 'src/domain/types/event-payload.type';

import { isRecipientTargetValid } from './resolve-recipient-target.util';

export function normalizeRecipientPayload(
  recipient: Record<string, unknown>,
  channel: NotificationChannel,
  index: number,
): EventRecipient {
  const { provider: _provider, ...recipientWithoutProvider } = recipient;
  const channelCode =
    typeof recipientWithoutProvider.channel === 'string'
      ? recipientWithoutProvider.channel
      : channel.code;

  if (!channelCode.trim()) {
    throw new BadRequestException(
      `payloadJson.recipients[${index}].channel es requerido`,
    );
  }

  const normalizedRecipient = {
    ...recipientWithoutProvider,
    channel: channel.code,
  } as EventRecipient;

  if (!isRecipientTargetValid(normalizedRecipient, channel)) {
    throw new BadRequestException(
      `payloadJson.recipients[${index}] tiene un destino inválido para el canal ${channelCode}`,
    );
  }

  return normalizedRecipient;
}

export function isPayloadFieldPresent(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
}
