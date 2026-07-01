import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/core/base.service';
import { ClientSystem } from 'src/domain/entities/client-system';
import { ClientSystemRepository } from 'src/domain/repositories/client-system.repository';
import { ClientSystemTokenService } from './client-system-token.service';
import { BusinessException } from 'src/shared/exceptions/business.exception';
import { ErrorCode } from 'src/shared/exceptions/error-codes';

@Injectable()
export class ClientSystemService extends BaseService<ClientSystem> {
  constructor(
    private readonly clientSystemRepository: ClientSystemRepository,
    private readonly tokenService: ClientSystemTokenService,
  ) {
    super(clientSystemRepository);
  }

  findByCode(code: string) {
    return this.clientSystemRepository.findByCode(code);
  }

  async deleteFromToken(id: string) {
    const clientSystem = await this.findOne(id);

    if (!clientSystem) {
      throw new BusinessException(
        'Sistema cliente no encontrado',
        ErrorCode.CLIENT_SYSTEM_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const tokens = await this.tokenService.findByClientSystemId(clientSystem.id);

    if (tokens.length > 0) {
      throw new BusinessException(
        'El sistema cliente tiene tokens asociados',
        ErrorCode.CLIENT_SYSTEM_HAS_TOKENS,
      );
    }

    await this.clientSystemRepository.delete(clientSystem.id);
  }
}
