import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories';
import type { DashboardAuthUser } from 'src/infrastructure/security/keycloak.strategy';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async me(authUser: DashboardAuthUser) {
    const byId = UUID_RE.test(authUser.id)
      ? await this.userRepository.findOne(authUser.id)
      : null;
    const user =
      byId ?? (await this.userRepository.findByUsername(authUser.username));

    if (user) {
      if (!user.active) {
        throw new UnauthorizedException('Usuario no autorizado');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles?.map((role) => role.code) ?? authUser.roles,
      };
    }

    return {
      id: authUser.id,
      username: authUser.username,
      email: authUser.email ?? null,
      fullName: authUser.fullName ?? authUser.username,
      roles: authUser.roles ?? [],
    };
  }

  async logout() {
    return {
      message: 'Cierre sesión en Keycloak para invalidar el token.',
    };
  }
}
