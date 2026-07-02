import {
  NotificationRecipientStatus,
  NotificationRecipientType,
} from '../enums';

export type NotificationRecipientData = {
  id: string;
  notificationRequestId: string;
  type: NotificationRecipientType;
  address: string;
  label: string | null;
  status: NotificationRecipientStatus;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export class NotificationRecipient implements NotificationRecipientData {
  id: string;
  notificationRequestId: string;
  type: NotificationRecipientType;
  address: string;
  label: string | null;
  status: NotificationRecipientStatus;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}
