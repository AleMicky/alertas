import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

import { NotificationChannel } from './notification-channel';
import { SeverityLevel } from './severity-level';

export class AlertRule extends BaseAuditableEntity {
  id: string;
  code: string;
  name: string;
  eventType: string;
  severityLevel: SeverityLevel;
  notificationChannel: NotificationChannel;
  titleTemplate: string;
  messageTemplate: string;
  active: boolean;
}
