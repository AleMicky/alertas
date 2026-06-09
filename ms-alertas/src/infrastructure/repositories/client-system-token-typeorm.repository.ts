import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { ClientSystemTokenRepository } from 'src/domain/repositories/client-system-token.repository';
import { ClientSystemTokenEntity } from '../typeorm/entities/client-system-token.entity';

@Injectable()
export class ClientSystemTokenTypeormRepository
  extends GenericRepository<ClientSystemTokenEntity>
  implements ClientSystemTokenRepository
{
  constructor(
    @InjectRepository(ClientSystemTokenEntity)
    repository: Repository<ClientSystemTokenEntity>,
  ) {
    super(repository);
  }

  async findByToken(
    tokenHash: string,
  ): Promise<ClientSystemTokenEntity | null> {
    return await this.repository.findOne({
      where: {
        tokenHash,
        active: true,
      },
      relations: {
        clientSystem: true,
      },
    });
  }

  async findByClientSystemId(
    clientSystemId: string,
  ): Promise<ClientSystemTokenEntity[]> {
    return await this.repository.find({
      where: {
        clientSystem: {
          id: clientSystemId,
        },
      },
      relations: {
        clientSystem: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findActive(): Promise<ClientSystemTokenEntity[]> {
    return await this.repository.find({
      where: {
        active: true,
      },
      relations: {
        clientSystem: true,
      },
    });
  }
}
