import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';
import { ClientSystem } from './client-system';
import { SeverityLevel } from './severity-level';

export class EventType extends BaseAuditableEntity {
  id: string;
  clientSystem: ClientSystem;
  code: string;
  name: string;
  description?: string;
  severityLevel?: SeverityLevel;
  active: boolean;
}
