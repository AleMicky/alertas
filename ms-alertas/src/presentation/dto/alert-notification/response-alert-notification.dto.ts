class NotificationChannelRef {
  id: string;
  code: string;
  name: string;
}

class AlertRef {
  id: string;
  status: string;
  title: string;
  message: string;
  alertDate: string;
}

export class ResponseAlertNotificationDto {
  id: string;
  alert: AlertRef;
  alertId: string;
  notificationChannel: NotificationChannelRef;
  notificationChannelId: string;
  target: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  sentAt?: string;
  payloadJson?: Record<string, unknown>;
  responseJson?: Record<string, unknown>;
  errorMessage?: string;
}
