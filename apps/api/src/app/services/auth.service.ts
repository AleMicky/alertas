import { Injectable } from '@nestjs/common';
import type { DashboardAuthUser } from 'src/infrastructure/security/keycloak.strategy';

@Injectable()
export class AuthService {
  async me(authUser: DashboardAuthUser) {
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
