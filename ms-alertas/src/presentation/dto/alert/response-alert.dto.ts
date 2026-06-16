import { ResponseEventDto } from '../event/response-event.dto';

export class AlertNotificationStatsDto {
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

export class ResponseAlertDto {
  id: string;
  eventId: string;
  event?: ResponseEventDto;
  status: string;
  title: string;
  message: string;
  reference?: string;
  alertDate: string;
  attendedAt?: string;
  notifiedAt?: string;
  failedAt?: string;
  active: boolean;
  notifications: AlertNotificationStatsDto;
}
