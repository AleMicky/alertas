import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';
import { NotificationChannelType } from '../enums/notification-channel-type.enum';

export class NotificationChannel extends BaseAuditableEntity {
  id: string;
  code: string;
  name: string;
  type: NotificationChannelType;
  webhookUrl: string;
  description?: string;
  active: boolean;
}
