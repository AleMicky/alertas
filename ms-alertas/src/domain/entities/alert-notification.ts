import { Alert } from './alert';
import { NotificationChannel } from './notification-channel';
import { AlertNotificationStatus } from '../enums/alert-notification-status.enum';

export class AlertNotification {
  id: string;
  alert: Alert;
  notificationChannel: NotificationChannel;
  target?: string;
  payloadJson?: Record<string, any>;
  status: AlertNotificationStatus;
  createdAt: Date;
  sentAt?: Date;
  responseJson?: Record<string, any>;
  errorMessage?: string;
}
