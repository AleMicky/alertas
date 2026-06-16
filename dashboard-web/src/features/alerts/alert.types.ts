import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';
import { Event } from '@/features/events/event.types';

export type AlertStatus = 'OPEN' | 'NOTIFIED' | 'RESOLVED' | 'FAILED';

export interface AlertNotificationStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

export interface Alert extends BaseAuditableEntity {
  id: string;
  event?: Event;
  eventId?: string;
  title: string;
  message: string;
  reference?: string;
  status: AlertStatus | string;
  alertDate: Date | string;
  attendedAt?: Date | string;
  notifiedAt?: Date | string;
  failedAt?: Date | string;
  active: boolean;
  notifications: AlertNotificationStats;
}
