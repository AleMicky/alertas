import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { ClientSystemTokenRepository } from 'src/domain/repositories/client-system-token.repository';
import { ClientSystemTokenEntity } from '../typeorm/entities/client-system-token.entity';
import { ClientSystemToken } from 'src/domain/entities';

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

  async findByClientSystemId(clientSystemId: string): Promise<ClientSystemToken[]> {
    return await this.repository.find({
      where: {
        clientSystemId,
        active: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByToken(token: string): Promise<ClientSystemToken | null> {
    return await this.repository.findOne({
      where: {
        tokenHash: token,
      },
    });
  }

  async findActive(): Promise<ClientSystemToken[]> {
    return await this.repository.find({
      where: {
        active: true,
      },
    });
  }
}
