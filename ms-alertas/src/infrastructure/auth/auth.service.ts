import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './auth-user.type';

type DashboardUser = {
  username: string;
  password: string;
  roles: string[];
  name: string;
  email?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(username: string, password: string) {
    const user = this.findUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload: JwtPayload = {
      sub: user.username,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn,
      user: {
        sub: user.username,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  private findUser(username: string, password: string): DashboardUser | null {
    const users = this.getDashboardUsers();

    return (
      users.find(
        (user) => user.username === username && user.password === password,
      ) ?? null
    );
  }

  private getDashboardUsers(): DashboardUser[] {
    return [
      {
        username: this.configService.get<string>(
          'DASHBOARD_ADMIN_USERNAME',
          'admin.alertas',
        ),
        password: this.configService.get<string>(
          'DASHBOARD_ADMIN_PASSWORD',
          'Admin123*',
        ),
        roles: ['admin'],
        name: 'Administrador',
        email: 'admin.alertas@local',
      },
      {
        username: this.configService.get<string>(
          'DASHBOARD_OPERATOR_USERNAME',
          'operador.alertas',
        ),
        password: this.configService.get<string>(
          'DASHBOARD_OPERATOR_PASSWORD',
          'Operador123*',
        ),
        roles: ['operador'],
        name: 'Operador',
        email: 'operador.alertas@local',
      },
    ];
  }
}
