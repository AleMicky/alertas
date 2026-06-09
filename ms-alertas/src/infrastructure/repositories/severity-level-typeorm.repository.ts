import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { SeverityLevelEntity } from '../typeorm/entities/severity-level.entity';
import { SeverityLevelRepository } from 'src/domain/repositories/severity-level.repository';

@Injectable()
export class SeverityLevelTypeormRepository
  extends GenericRepository<SeverityLevelEntity>
  implements SeverityLevelRepository
{
  constructor(
    @InjectRepository(SeverityLevelEntity)
    repository: Repository<SeverityLevelEntity>,
  ) {
    super(repository);
  }

  findByCode(code: string) {
    return this.repository.findOne({ where: { code } });
  }
}
