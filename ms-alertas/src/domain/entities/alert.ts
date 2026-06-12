import { Event } from './event';
import { AlertStatus } from '../enums/alert-status.enum';

export class Alert {
  id: string;
  event: Event;
  status: AlertStatus;
  createdAt: Date;
  resolvedAt?: Date;
  notifiedAt?: Date | null;
  failedAt?: Date | null;
}
