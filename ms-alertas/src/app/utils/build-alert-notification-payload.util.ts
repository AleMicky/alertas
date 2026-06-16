import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { EventRecipient } from 'src/domain/types/event-payload.type';

import { resolveRecipientTarget } from './resolve-recipient-target.util';

export function buildAlertNotificationPayload(
  recipient: EventRecipient,
  channel: NotificationChannel,
): { target: string; payloadJson: Record<string, unknown> } {
  const target = resolveRecipientTarget(recipient, channel);

  if (!target) {
    throw new Error(
      `No se pudo resolver el destino para el canal ${channel.code}`,
    );
  }

  const { channel: _channel, ...payload } = recipient;

  return {
    target,
    payloadJson: payload,
  };
}
