import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type DashboardAuthUser = {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  roles: string[];
};

type KeycloakJwtPayload = {
  sub: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

@Injectable()
export class KeycloakJwtStrategy extends PassportStrategy(
  Strategy,
  'keycloak',
) {
  private readonly clientId?: string;

  constructor(configService: ConfigService) {
    const issuer = configService.getOrThrow<string>('KEYCLOAK_ISSUER').trim();
    const jwksUri =
      configService.get<string>('KEYCLOAK_JWKS_URI')?.trim() ||
      `${issuer}/protocol/openid-connect/certs`;
    const audience = configService.get<string>('KEYCLOAK_AUDIENCE')?.trim();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer,
      audience: audience || undefined,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
    });

    this.clientId =
      configService.get<string>('KEYCLOAK_CLIENT_ID')?.trim() || undefined;
  }

  validate(payload: KeycloakJwtPayload): DashboardAuthUser {
    const username = payload.preferred_username || payload.email;
    if (!username) {
      throw new UnauthorizedException(
        'Token Keycloak sin preferred_username ni email',
      );
    }

    // Keycloak puede omitir `sub` en access tokens (p. ej. mappers del realm);
    // el id_token sí lo trae. Fallback estable: username.
    const id = payload.sub || username;
    if (!id) {
      throw new UnauthorizedException('Token Keycloak inválido');
    }

    const fullName =
      payload.name ||
      [payload.given_name, payload.family_name].filter(Boolean).join(' ') ||
      undefined;

    return {
      id,
      username,
      email: payload.email,
      fullName,
      roles: this.extractRoles(payload),
    };
  }

  private extractRoles(payload: KeycloakJwtPayload): string[] {
    const realmRoles = payload.realm_access?.roles ?? [];
    const clientRoles = this.clientId
      ? (payload.resource_access?.[this.clientId]?.roles ?? [])
      : [];

    const roles = [...realmRoles, ...clientRoles]
      .map((role) => role.trim().toUpperCase())
      .filter((role) => role.length > 0);

    return [...new Set(roles)];
  }
}
