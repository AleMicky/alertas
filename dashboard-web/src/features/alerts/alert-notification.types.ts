import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';

import { Alert } from './alert.types';

export type AlertNotificationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SENT'
  | 'FAILED';

export interface AlertNotification {
  id: string;
  alert?: Alert;
  alertId?: string;
  notificationChannel?: NotificationChannel;
  notificationChannelId?: string;
  target: string;
  title: string;
  message: string;
  status: AlertNotificationStatus | string;
  sentAt?: Date | string;
  responseJson?: Record<string, unknown>;
  response_json?: Record<string, unknown>;
  errorMessage?: string;
  error_message?: string;
  payloadJson?: Record<string, unknown>;
  payload_json?: Record<string, unknown>;
}
