import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

export class NotificationChannel extends BaseAuditableEntity {
  id: string;
  code: string;
  name: string;
}
