import { EventRecipient } from 'src/domain/types/event-payload.type';

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

export function resolveRecipientTarget(
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

export function isRecipientTargetValid(recipient: EventRecipient): boolean {
  return Boolean(resolveRecipientTarget(recipient));
}
