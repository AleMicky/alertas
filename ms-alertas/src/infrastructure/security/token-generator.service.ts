import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  ClientSystemRepository,
  ClientSystemTokenRepository,
} from 'src/domain/repositories';

@Injectable()
export class TokenGeneratorService {
  constructor(
    private readonly clientSystemRepository: ClientSystemRepository,
    private readonly clientSystemTokenRepository: ClientSystemTokenRepository,
  ) { }

  async generateToken(): Promise<{ plainToken: string; tokenHash: string }> {
    const plainToken = `msa_${randomBytes(32).toString('hex')}`;
    const tokenHash = await bcrypt.hash(plainToken, 10);
    return {
      plainToken,
      tokenHash,
    };
  }

  async compareToken(plainToken: string, tokenHash: string): Promise<boolean> {
    return bcrypt.compare(plainToken, tokenHash);
  }

  async createToken(clientSystemId: string, expiresAt: Date): Promise<string> {

    const clientSystem = await this.clientSystemRepository.findOne(clientSystemId);

    if (!clientSystem) {
      throw new NotFoundException('Sistema cliente no encontrado');
    }

    const { plainToken, tokenHash } = await this.generateToken();

    await this.clientSystemTokenRepository.create({
      clientSystemId: clientSystem.id,
      tokenHash,
      expiresAt,
    });
    
    return plainToken;
  }

  async revokeToken(tokenId: string): Promise<void> {
    const token = await this.clientSystemTokenRepository.findOne(tokenId);

    if (!token) {
      throw new NotFoundException('Token no encontrado');
    }

    if (!token.active) {
      throw new BadRequestException('Token ya ha sido revocado');
    }

    await this.clientSystemTokenRepository.update(tokenId, {
      active: false,
    });
  }

  async validateToken(plainToken: string) {
    const tokens = await this.clientSystemTokenRepository.findActive();

    for (const token of tokens) {
      const isValid = await bcrypt.compare(plainToken, token.tokenHash);

      if (!isValid) {
        continue;
      }

      if (token.expiresAt && this.isExpiredDate(token.expiresAt)) {
        throw new UnauthorizedException('Token expirado');
      }

      const clientSystemFromToken =
        await this.clientSystemRepository.findOne(token.clientSystemId);

      if (!clientSystemFromToken) {
        throw new UnauthorizedException('Sistema cliente no encontrado');
      }

      return clientSystemFromToken;
    }

    throw new UnauthorizedException('Token inválido');
  }

  private isExpiredDate(expiresAt: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiration = new Date(expiresAt);
    expiration.setHours(0, 0, 0, 0);

    return today > expiration;
  }
}
