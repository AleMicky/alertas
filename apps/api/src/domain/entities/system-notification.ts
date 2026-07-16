import { SystemNotificationType } from '../enums';

export type SystemNotificationData = {
  id: string;
  type: SystemNotificationType;
  title: string;
  body: string | null;
  href: string | null;
  notificationRequestId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

export type SystemNotificationWithReadState = SystemNotificationData & {
  read: boolean;
  readAt: Date | null;
};

export class SystemNotification implements SystemNotificationData {
  id: string;
  type: SystemNotificationType;
  title: string;
  body: string | null;
  href: string | null;
  notificationRequestId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}
