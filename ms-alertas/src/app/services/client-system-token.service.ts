import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BaseService } from 'src/shared/core/base.service';
import { ClientSystemToken } from 'src/domain/entities/client-system-token';
import {
  ClientSystemRepository,
  ClientSystemTokenRepository,
} from 'src/domain/repositories';
import { CreateClientSystemTokenDto } from 'src/presentation/dto/client-system-token';
import { TokenGeneratorService } from 'src/infrastructure/security/token-generator.service';

@Injectable()
export class ClientSystemTokenService extends BaseService<ClientSystemToken> {
  constructor(
    private readonly clientSystemTokenRepository: ClientSystemTokenRepository,
    private readonly clientSystemRepository: ClientSystemRepository,
    private readonly tokenGeneratorService: TokenGeneratorService,
  ) {
    super(clientSystemTokenRepository);
  }

  findByClientSystemId(clientSystemId: string) {
    return this.clientSystemTokenRepository.findByClientSystemId(
      clientSystemId,
    );
  }

  async create(
    dto: CreateClientSystemTokenDto | Partial<ClientSystemToken>,
  ): Promise<ClientSystemToken> {
    const clientSystemId =
      'clientSystemId' in dto ? dto.clientSystemId : dto.clientSystem?.id;

    if (!clientSystemId) {
      throw new BadRequestException('clientSystemId es requerido');
    }

    const clientSystem =
      await this.clientSystemRepository.findOne(clientSystemId);

    if (!clientSystem) {
      throw new NotFoundException('Sistema cliente no encontrado');
    }

    const { tokenHash } = await this.tokenGeneratorService.generateToken();

    return this.clientSystemTokenRepository.create({
      clientSystem,
      tokenHash,
      description: dto.description,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      active: dto.active ?? true,
    });
  }

  async createToken(
    clientSystemId: string,
    description?: string,
    expiresAt?: Date,
  ) {
    const plainToken = await this.tokenGeneratorService.createToken(
      clientSystemId,
      description,
      expiresAt,
    );

    return {
      message: 'Guarde este token, no podrá visualizarse nuevamente.',
      token: plainToken,
    };
  }

  revokeToken(tokenId: string) {
    return this.tokenGeneratorService.revokeToken(tokenId);
  }

  validateToken(plainToken: string) {
    return this.tokenGeneratorService.validateToken(plainToken);
  }
}
