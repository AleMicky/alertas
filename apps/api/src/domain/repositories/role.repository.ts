import { BaseRepository } from 'src/shared/core/base.repository';
import { Role } from '../entities/role';

export abstract class RoleRepository extends BaseRepository<Role> {
    abstract findByCode(code: string): Promise<Role | null>;
}