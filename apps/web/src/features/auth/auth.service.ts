import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';
import type { ChangePasswordDto, LoginDto } from './auth.schema';
import type {
  AuthUser,
  ChangePasswordResponse,
  LoginResponse,
  RefreshResponse,
} from './auth.types';

const endpoint = '/auth';

export const authService = {
  login: async (payload: LoginDto): Promise<LoginResponse> => {
    const { data } = await http.post(`${endpoint}/login`, payload);
    const response = unwrapApiResponse<LoginResponse>(data);

    if (!response?.accessToken || !response?.refreshToken || !response?.user) {
      throw new Error('Respuesta de login inválida');
    }

    return response;
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const { data } = await http.post(`${endpoint}/refresh`, {
      refreshToken,
    });

    return unwrapApiResponse<RefreshResponse>(data);
  },

  logout: async (): Promise<void> => {
    await http.post(`${endpoint}/logout`);
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await http.get(`${endpoint}/me`);
    return unwrapApiResponse<AuthUser>(data);
  },

  changePassword: async (
    payload: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> => {
    const { data } = await http.post(`${endpoint}/change-password`, payload);
    return unwrapApiResponse<ChangePasswordResponse>(data);
  },
};
