import {
  NotificationPriority,
  NotificationRequestStatus,
} from './notification-request.types';

export const NOTIFICATION_REQUEST_STATUS_LABELS: Record<
  NotificationRequestStatus,
  string
> = {
  RECEIVED: 'Recibida',
  QUEUED: 'En cola',
  PROCESSING: 'Procesando',
  SENT: 'Enviada',
  PARTIAL: 'Parcial',
  FAILED: 'Fallida',
  CANCELED: 'Cancelada',
};

export const NOTIFICATION_PRIORITY_LABELS: Record<NotificationPriority, string> =
  {
    LOW: 'Baja',
    NORMAL: 'Normal',
    HIGH: 'Alta',
    URGENT: 'Urgente',
  };

export function getNotificationRequestStatusVariant(
  status: NotificationRequestStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'SENT':
      return 'default';
    case 'PARTIAL':
      return 'secondary';
    case 'FAILED':
    case 'CANCELED':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function getNotificationRequestStatusClass(
  status: NotificationRequestStatus,
): string {
  switch (status) {
    case 'SENT':
      return 'bg-emerald-600/90 hover:bg-emerald-600';
    case 'PARTIAL':
      return 'bg-amber-500/90 hover:bg-amber-500 text-white';
    case 'FAILED':
    case 'CANCELED':
      return '';
    case 'PROCESSING':
      return 'bg-blue-600/90 hover:bg-blue-600';
    case 'QUEUED':
      return 'bg-violet-600/90 hover:bg-violet-600';
    default:
      return '';
  }
}

export function canCancelNotificationRequest(
  status: NotificationRequestStatus,
): boolean {
  return ['RECEIVED', 'QUEUED', 'FAILED'].includes(status);
}

export function canRequeueNotificationRequest(
  status: NotificationRequestStatus,
): boolean {
  return ['FAILED', 'PARTIAL', 'QUEUED'].includes(status);
}

export function canRetryFailedNotificationRequest(
  status: NotificationRequestStatus,
): boolean {
  return ['FAILED', 'PARTIAL'].includes(status);
}

export function extractClientPayloadFromStoredPayload(
  storedPayload: Record<string, unknown>,
): Record<string, unknown> {
  const { channel: _channel, target: _target, ...clientPayload } = storedPayload;

  return clientPayload;
}

export function resolveNotificationRequestChannelCode(
  payload: Record<string, unknown>,
  channelCode?: string | null,
): string | undefined {
  if (channelCode?.trim()) {
    return channelCode.trim();
  }

  const fromPayload = payload.channel;

  return typeof fromPayload === 'string' && fromPayload.trim()
    ? fromPayload.trim()
    : undefined;
}
