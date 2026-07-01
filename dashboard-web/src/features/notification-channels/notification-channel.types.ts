import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export interface NotificationChannel extends BaseAuditableEntity {
  id: string;
  code: string;
  name: string;
  active?: boolean;
}
