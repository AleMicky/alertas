import { NotificationPriority, NotificationRequestStatus } from '../enums';

export type NotificationRequestData = {
  id: string;
  clientSystemId: string;
  notificationChannelId: string | null;
  externalReference: string | null;
  correlationId: string | null;
  idempotencyKey: string | null;
  title: string | null;
  message: string | null;
  payload: Record<string, any>;
  metadata: Record<string, any> | null;
  status: NotificationRequestStatus;
  priority: NotificationPriority;
  scheduledAt: Date | null;
  expiresAt: Date | null;
  archivedAt: Date | null;
  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class NotificationRequest implements NotificationRequestData {
  id: string;
  clientSystemId: string;
  notificationChannelId: string | null;
  externalReference: string | null;
  correlationId: string | null;
  idempotencyKey: string | null;
  title: string | null;
  message: string | null;
  payload: Record<string, any>;
  metadata: Record<string, any> | null;
  status: NotificationRequestStatus;
  priority: NotificationPriority;
  scheduledAt: Date | null;
  expiresAt: Date | null;
  archivedAt: Date | null;
  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  markQueued(): void {
    this.status = NotificationRequestStatus.QUEUED;
    this.updatedAt = new Date();
  }

  markProcessing(): void {
    this.status = NotificationRequestStatus.PROCESSING;
    this.updatedAt = new Date();
  }

  markSent(): void {
    this.status = NotificationRequestStatus.SENT;
    this.updatedAt = new Date();
  }

  markPartial(): void {
    this.status = NotificationRequestStatus.PARTIAL;
    this.updatedAt = new Date();
  }

  markFailed(): void {
    this.status = NotificationRequestStatus.FAILED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = NotificationRequestStatus.CANCELED;
    this.updatedAt = new Date();
  }

  isExpired(now = new Date()): boolean {
    return Boolean(this.expiresAt && this.expiresAt.getTime() <= now.getTime());
  }

  isEditable(): boolean {
    return (
      this.status === NotificationRequestStatus.RECEIVED ||
      this.status === NotificationRequestStatus.QUEUED
    );
  }
}
