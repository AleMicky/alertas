import { BaseRepository } from 'src/shared/core/base.repository';
import { ClientSystem } from '../entities/client-system';

export abstract class ClientSystemRepository extends BaseRepository<ClientSystem> {
  abstract findByCode(code: string): Promise<ClientSystem | null>;
}
