import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { EventRecipient } from 'src/domain/types/event-payload.type';

import { getChannelRequiredFields } from './normalize-recipient-payload.util';
import { getNotificationChannelKind } from './normalize-notification-channel.util';

function firstNonEmptyString(values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function firstEmailFromList(values?: unknown[]): string | undefined {
  if (!Array.isArray(values)) {
    return undefined;
  }

  return firstNonEmptyString(values);
}

function resolveTargetFromSchema(
  recipient: EventRecipient,
  channel: NotificationChannel,
): string | undefined {
  const requiredFields = getChannelRequiredFields(channel);

  for (const field of requiredFields) {
    const value = recipient[field];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    if (Array.isArray(value)) {
      const resolved = firstNonEmptyString(value);
      if (resolved) {
        return resolved;
      }
    }
  }

  return undefined;
}

function resolveLegacyRecipientTarget(
  recipient: EventRecipient,
): string | undefined {
  const kind = getNotificationChannelKind(recipient.channel);

  if (kind === 'EMAIL') {
    return firstEmailFromList(recipient.to);
  }

  if (kind === 'TELEGRAM') {
    return firstNonEmptyString([recipient.chatId, recipient.target]);
  }

  if (kind === 'WHATSAPP') {
    return firstNonEmptyString([
      recipient.phone,
      recipient.to?.[0],
      recipient.target,
    ]);
  }

  if (kind === 'TEAMS') {
    return firstNonEmptyString([
      recipient.email,
      recipient.webhookUrl,
      recipient.target,
    ]);
  }

  if (kind === 'GOOGLE_CALENDAR') {
    return firstNonEmptyString([recipient.attendee, recipient.target]);
  }

  return firstNonEmptyString([recipient.target, recipient.to?.[0]]);
}

export function resolveRecipientTarget(
  recipient: EventRecipient,
  channel?: NotificationChannel,
): string | undefined {
  const legacyTarget = resolveLegacyRecipientTarget(recipient);

  if (legacyTarget) {
    return legacyTarget;
  }

  if (channel) {
    return resolveTargetFromSchema(recipient, channel);
  }

  return undefined;
}

export function isRecipientTargetValid(
  recipient: EventRecipient,
  channel?: NotificationChannel,
): boolean {
  return Boolean(resolveRecipientTarget(recipient, channel));
}
