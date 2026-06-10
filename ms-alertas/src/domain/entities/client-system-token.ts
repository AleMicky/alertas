import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

export class ClientSystemToken extends BaseAuditableEntity {
  id: string;
  clientSystemId: string;
  tokenHash: string;
  expiresAt: Date;
}
