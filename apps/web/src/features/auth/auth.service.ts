import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';
import type { LoginDto } from './auth.schema';
import type { AuthUser, LoginResponse } from './auth.types';
import { keycloakToken } from './keycloak-token';

const endpoint = '/auth';

export const authService = {
  login: async (payload: LoginDto): Promise<LoginResponse> => {
    const tokens = await keycloakToken.login(
      payload.username,
      payload.password,
    );

    const { data } = await http.get(`${endpoint}/me`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    const user = unwrapApiResponse<AuthUser>(data);

    if (!user?.id || !user?.username) {
      throw new Error('Respuesta de perfil inválida');
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      user,
    };
  },

  refresh: async (
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const tokens = await keycloakToken.refresh(refreshToken);
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  },

  logout: async (): Promise<void> => {
    try {
      await http.post(`${endpoint}/logout`);
    } catch {
      // El cierre real de sesión es local; el API solo confirma.
    }
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await http.get(`${endpoint}/me`);
    return unwrapApiResponse<AuthUser>(data);
  },
};
