import { NotificationDeliveryStatus } from '../enums';

export type NotificationDeliveryData = {
  id: string;
  notificationRequestId: string;
  notificationChannelProviderId: string | null;
  status: NotificationDeliveryStatus;
  attemptCount: number;
  providerMessageId: string | null;
  errorMessage: string | null;
  lastAttemptAt: Date | null;
  deliveredAt: Date | null;
  failedAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export class NotificationDelivery implements NotificationDeliveryData {
  id: string;
  notificationRequestId: string;
  notificationChannelProviderId: string | null;
  status: NotificationDeliveryStatus;
  attemptCount: number;
  providerMessageId: string | null;
  errorMessage: string | null;
  lastAttemptAt: Date | null;
  deliveredAt: Date | null;
  failedAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}
