export type SystemNotificationType = 'NOTIFICATION_REQUEST_CREATED';

export type SystemNotification = {
  id: string;
  type: SystemNotificationType;
  title: string;
  body: string | null;
  href: string | null;
  notificationRequestId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  read: boolean;
  readAt: string | null;
};

export type SystemNotificationUnreadCount = {
  count: number;
};

export type SystemNotificationMarkAllReadResult = {
  marked: number;
};
