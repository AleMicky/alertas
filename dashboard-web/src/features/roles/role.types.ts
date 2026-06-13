import type { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export interface Role extends BaseAuditableEntity {
  id: string;
  code: string;
  name: string;
  active?: boolean;
}
