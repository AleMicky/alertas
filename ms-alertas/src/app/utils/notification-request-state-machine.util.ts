import { BadRequestException } from '@nestjs/common';

import { NotificationRequestStatus } from 'src/domain/enums';

const ALLOWED_TRANSITIONS: Record<
  NotificationRequestStatus,
  NotificationRequestStatus[]
> = {
  [NotificationRequestStatus.RECEIVED]: [
    NotificationRequestStatus.QUEUED,
    NotificationRequestStatus.CANCELED,
  ],
  [NotificationRequestStatus.QUEUED]: [
    NotificationRequestStatus.PROCESSING,
    NotificationRequestStatus.CANCELED,
    NotificationRequestStatus.FAILED,
  ],
  [NotificationRequestStatus.PROCESSING]: [
    NotificationRequestStatus.QUEUED,
    NotificationRequestStatus.SENT,
    NotificationRequestStatus.PARTIAL,
    NotificationRequestStatus.FAILED,
  ],
  [NotificationRequestStatus.SENT]: [],
  [NotificationRequestStatus.PARTIAL]: [
    NotificationRequestStatus.QUEUED,
    NotificationRequestStatus.SENT,
    NotificationRequestStatus.FAILED,
  ],
  [NotificationRequestStatus.FAILED]: [
    NotificationRequestStatus.QUEUED,
    NotificationRequestStatus.CANCELED,
  ],
  [NotificationRequestStatus.CANCELED]: [],
};

export function assertNotificationRequestStatusTransition(
  from: NotificationRequestStatus,
  to: NotificationRequestStatus,
) {
  if (from === to) {
    return;
  }

  const allowed = ALLOWED_TRANSITIONS[from] ?? [];

  if (!allowed.includes(to)) {
    throw new BadRequestException(
      `Transición de estado inválida: ${from} → ${to}`,
    );
  }
}

export function canTransitionNotificationRequestStatus(
  from: NotificationRequestStatus,
  to: NotificationRequestStatus,
) {
  if (from === to) {
    return true;
  }

  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to);
}

export const CANCELABLE_NOTIFICATION_REQUEST_STATUSES = new Set([
  NotificationRequestStatus.RECEIVED,
  NotificationRequestStatus.QUEUED,
  NotificationRequestStatus.FAILED,
]);

export const PROCESSABLE_NOTIFICATION_REQUEST_STATUSES = new Set([
  NotificationRequestStatus.RECEIVED,
  NotificationRequestStatus.QUEUED,
  NotificationRequestStatus.PROCESSING,
  NotificationRequestStatus.PARTIAL,
  NotificationRequestStatus.FAILED,
]);

export const EDITABLE_NOTIFICATION_REQUEST_STATUSES = new Set([
  NotificationRequestStatus.RECEIVED,
  NotificationRequestStatus.QUEUED,
]);
