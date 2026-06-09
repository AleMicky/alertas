import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

export class SeverityLevel extends BaseAuditableEntity {
  id: string;
  code: string;
  name: string;
  description?: string;
  priority: number;
  attentionTimeMinutes?: number;
  active: boolean;
}
