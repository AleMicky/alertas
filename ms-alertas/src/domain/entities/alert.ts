import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

import { AlertRule } from './alert-rule';
import { Event } from './event';
import { SeverityLevel } from './severity-level';
import { AlertStatus } from '../enums/alert-status.enum';

export class Alert extends BaseAuditableEntity {
  id: string;
  event: Event;
  alertRule: AlertRule;
  severityLevel: SeverityLevel;
  title: string;
  message: string;
  status: AlertStatus;
  alertDate: Date;
  attendedAt?: Date;
  active: boolean;
}
