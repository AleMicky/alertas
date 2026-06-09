import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/core/base.service';
import { ClientSystem } from 'src/domain/entities/client-system';
import { ClientSystemRepository } from 'src/domain/repositories/client-system.repository';

@Injectable()
export class ClientSystemService extends BaseService<ClientSystem> {
  constructor(private readonly clientSystemRepository: ClientSystemRepository) {
    super(clientSystemRepository);
  }

  findByCode(code: string) {
    return this.clientSystemRepository.findByCode(code);
  }
}
