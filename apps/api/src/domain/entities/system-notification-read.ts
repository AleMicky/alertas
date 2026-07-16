export type SystemNotificationReadData = {
  id: string;
  systemNotificationId: string;
  userId: string;
  readAt: Date;
};

export class SystemNotificationRead implements SystemNotificationReadData {
  id: string;
  systemNotificationId: string;
  userId: string;
  readAt: Date;
}
