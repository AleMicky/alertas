import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { authStorage } from '@/features/auth/auth-storage';
import {
  type ApiResponse,
  unwrapApiResponse,
} from '@/lib/api-response';

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return null;

  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.post<ApiResponse<{ accessToken: string }>>(
    `${baseURL}/auth/refresh`,
    { refreshToken },
  );

  const accessToken = unwrapApiResponse<{ accessToken: string }>(
    response.data,
  ).accessToken;
  authStorage.setAccessToken(accessToken);
  return accessToken;
}

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

http.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => {
    response.data = unwrapApiResponse(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? '';
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (!newToken) {
      authStorage.clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return http(originalRequest);
  },
);
