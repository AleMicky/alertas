import { http } from '@/lib/http';
import type { LoginDto } from './auth.schema';
import type { LoginResponse, RefreshResponse } from './auth.types';

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
};
