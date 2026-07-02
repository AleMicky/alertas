import { NotificationRequestStatus } from '../enums';

export type NotificationRequestAuditData = {
  id: string;
  notificationRequestId: string;
  fromStatus: NotificationRequestStatus | null;
  toStatus: NotificationRequestStatus;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  changedBy: string | null;
  changedAt: Date;
};

export class NotificationRequestAudit implements NotificationRequestAuditData {
  id: string;
  notificationRequestId: string;
  fromStatus: NotificationRequestStatus | null;
  toStatus: NotificationRequestStatus;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  changedBy: string | null;
  changedAt: Date;
}
