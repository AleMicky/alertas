import { http } from '@/lib/http';
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
    const { data } = await http.post<LoginResponse>(`${endpoint}/login`, payload);
    return data;
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const { data } = await http.post<RefreshResponse>(`${endpoint}/refresh`, {
      refreshToken,
    });
    return data;
  },

  logout: async (): Promise<void> => {
    await http.post(`${endpoint}/logout`);
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await http.get<AuthUser>(`${endpoint}/me`);
    return data;
  },

  changePassword: async (
    payload: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> => {
    const { data } = await http.post<ChangePasswordResponse>(
      `${endpoint}/change-password`,
      payload,
    );
    return data;
  },
};
