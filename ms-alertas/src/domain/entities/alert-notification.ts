import { AlertNotificationStatus } from '../enums/alert-notification-status.enum';
import { Alert } from './alert';
import { NotificationChannel } from './notification-channel';

export class AlertNotification {
  id: string;
  alert: Alert;
  notificationChannel: NotificationChannel;
  target: string;
  title: string;
  message: string;
  status: AlertNotificationStatus;
  sentAt?: Date;
  responseJson?: Record<string, any>;
  errorMessage?: string;
  payloadJson?: Record<string, any>;
}
