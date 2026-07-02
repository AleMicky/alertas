import { NotificationDeliveryStatus } from '../enums';

export type NotificationDeliveryAttemptData = {
  id: string;
  notificationDeliveryId: string;
  attemptNumber: number;
  status: NotificationDeliveryStatus;
  requestPayload: Record<string, unknown> | null;
  responsePayload: Record<string, unknown> | null;
  errorMessage: string | null;
  attemptedAt: Date;
  createdAt: Date;
};

export class NotificationDeliveryAttempt implements NotificationDeliveryAttemptData {
  id: string;
  notificationDeliveryId: string;
  attemptNumber: number;
  status: NotificationDeliveryStatus;
  requestPayload: Record<string, unknown> | null;
  responsePayload: Record<string, unknown> | null;
  errorMessage: string | null;
  attemptedAt: Date;
  createdAt: Date;
}
