import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ClientSystemTokenService } from 'src/app/services/client-system-token.service';

@Injectable()
export class ClientSystemAuthGuard implements CanActivate {
  constructor(
    private readonly clientSystemTokenService: ClientSystemTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token requerido');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    if (token.startsWith('$2')) {
      throw new UnauthorizedException(
        'Está usando el hash guardado en base de datos. Use el token plano (msa_...) devuelto al generarlo.',
      );
    }

    if (!token.startsWith('msa_')) {
      throw new UnauthorizedException(
        'Token inválido. Debe ser el valor plano que empieza con msa_',
      );
    }

    const clientSystem =
      await this.clientSystemTokenService.validateToken(token);

    request.clientSystem = clientSystem;

    return true;
  }
}
