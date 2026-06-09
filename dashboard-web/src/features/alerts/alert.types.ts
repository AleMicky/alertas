import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';
import { Event } from '@/features/events/event.types';
import { SeverityLevel } from '@/features/severity-levels/severity-level.types';

export type AlertStatus = 'OPEN' | 'NOTIFIED' | 'RESOLVED' | 'FAILED';

export interface AlertRule {
  id: string;
  name?: string;
  code?: string;
}

export interface Alert extends BaseAuditableEntity {
  id: string;
  event?: Event;
  eventId?: string;
  alertRule?: AlertRule;
  alertRuleId?: string;
  severityLevel?: SeverityLevel;
  severityLevelId?: string;
  title: string;
  message: string;
  status: AlertStatus | string;
  alertDate: Date | string;
  attendedAt?: Date | string;
  active: boolean;
}
