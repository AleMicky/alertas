import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

import { ClientSystem } from './client-system';

export class ClientSystemToken extends BaseAuditableEntity {
  id: string;
  tokenHash: string;
  description?: string;
  expiresAt?: Date | null;
  lastUsedAt?: Date | null;
  active: boolean;
  clientSystem: ClientSystem;
}
