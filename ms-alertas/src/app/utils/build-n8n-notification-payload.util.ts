import { AlertNotification } from 'src/domain/entities/alert-notification';
import { EventPayload } from 'src/domain/types/event-payload.type';

import { getNotificationChannelKind } from './normalize-notification-channel.util';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

export function resolveNotificationTitle(
  payload: Record<string, unknown>,
  eventTypeName?: string,
): string {
  const subject = payload.subject;
  const title = payload.title;

  if (typeof subject === 'string' && subject.trim()) {
    return subject.trim();
  }

  if (typeof title === 'string' && title.trim()) {
    return title.trim();
  }

  return eventTypeName?.trim() || 'Notificación';
}

export function resolveNotificationMessage(
  payload: Record<string, unknown>,
  eventTypeDescription?: string,
  title?: string,
): string {
  const message = payload.message;

  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  return eventTypeDescription?.trim() || title || 'Notificación';
}

export function buildN8nNotificationPayload(
  notification: AlertNotification,
): Record<string, unknown> {
  const event = notification.alert.event;
  const eventPayload = (event.payloadJson ?? {}) as EventPayload;
  const metadata = asRecord(eventPayload.metadata) ?? {};
  const recipientPayload = notification.payloadJson ?? {};
  const channelCode = notification.notificationChannel.code;
  const title = resolveNotificationTitle(
    recipientPayload,
    event.eventTypeCode,
  );
  const message = resolveNotificationMessage(
    recipientPayload,
    undefined,
    title,
  );
  const reference =
    typeof metadata.reference === 'string'
      ? metadata.reference
      : undefined;

  return {
    notificationId: notification.id,
    alertId: notification.alert.id,
    eventId: event.id,
    channel: channelCode,
    channelKind: getNotificationChannelKind(channelCode),
    target: notification.target,
    title,
    message,
    ...(reference ? { reference } : {}),
    metadata,
    eventType: event.eventTypeCode
      ? { code: event.eventTypeCode }
      : undefined,
    clientSystem: event.clientSystem
      ? {
          code: event.clientSystem.code,
          name: event.clientSystem.name,
        }
      : undefined,
    payload: recipientPayload,
  };
}
