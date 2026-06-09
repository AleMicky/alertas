import { BaseRepository } from 'src/shared/core/base.repository';
import { SeverityLevel } from '../entities/severity-level';

export abstract class SeverityLevelRepository extends BaseRepository<SeverityLevel> {
  abstract findByCode(code: string): Promise<SeverityLevel | null>;
}
