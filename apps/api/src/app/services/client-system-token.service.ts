import { Injectable } from '@nestjs/common';
import { ClientSystemToken } from 'src/domain/entities/client-system-token';
import { ClientSystemTokenRepository } from 'src/domain/repositories';
import { CreateClientSystemTokenDto } from 'src/presentation/dto/client-system-token';
import { TokenGeneratorService } from 'src/infrastructure/security/token-generator.service';

@Injectable()
export class ClientSystemTokenService {
  constructor(
    private readonly tokenRepository: ClientSystemTokenRepository,
    private readonly tokenGeneratorService: TokenGeneratorService,
  ) {
  }

  async findByClientSystemId(id: string) {
    const tokens = await this.tokenRepository.findByClientSystemId(id);
    return tokens.map((token) => this.toPublicResponse(token));

  }

  async createToken(clientSystemId: string, dto: CreateClientSystemTokenDto) {
    const plainToken = await this.tokenGeneratorService.createToken(clientSystemId, dto.expiresAt);
    return {
      message: 'Guarde este token, no podrá visualizarse nuevamente.',
      token: plainToken,
    };
  }

  async revokeToken(id: string) {
    await this.tokenGeneratorService.revokeToken(id);
    return {
      message: 'Token revocado correctamente.',
    };
  }
  
  validateToken(plainToken: string) {
    return this.tokenGeneratorService.validateToken(plainToken);
  }

  toPublicResponse(token: ClientSystemToken) {
    const { tokenHash: _tokenHash, ...rest } = token;
    return {
      ...rest,
      token: `msa_••••••••${token.id.replace(/-/g, '').slice(-8)}`,
    };
  }


}
