import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { ClientSystemRepository } from 'src/domain/repositories/client-system.repository';
import { ClientSystemEntity } from '../typeorm/entities/client-system.entity';

@Injectable()
export class ClientSystemTypeormRepository
  extends GenericRepository<ClientSystemEntity>
  implements ClientSystemRepository
{
  constructor(
    @InjectRepository(ClientSystemEntity)
    repository: Repository<ClientSystemEntity>,
  ) {
    super(repository);
  }

  findByCode(code: string): Promise<ClientSystemEntity | null> {
    return this.repository.findOne({
      where: { code },
    });
  }
}
