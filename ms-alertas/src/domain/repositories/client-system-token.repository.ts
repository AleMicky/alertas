import { BaseRepository } from 'src/shared/core/base.repository';

import { ClientSystemToken } from '../entities/client-system-token';

export abstract class ClientSystemTokenRepository extends BaseRepository<ClientSystemToken> {
  abstract findByToken(token: string): Promise<ClientSystemToken | null>;
  abstract findByClientSystemId(
    clientSystemId: string,
  ): Promise<ClientSystemToken[]>;
  abstract findActive(): Promise<ClientSystemToken[]>;
}
