import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

export class ClientSystem extends BaseAuditableEntity {
  id: string;
  code: string;
  name: string;
  description?: string;
}
