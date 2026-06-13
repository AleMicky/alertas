import type { AuthUser } from './auth.types';

const ACCESS_TOKEN_KEY = 'dashboard_access_token';
const REFRESH_TOKEN_KEY = 'dashboard_refresh_token';
const AUTH_USER_KEY = 'dashboard_auth_user';
const SESSION_COOKIE = 'dashboard_session';

function isBrowser() {
  return typeof window !== 'undefined';
}

export const authStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setSession(accessToken: string, refreshToken: string, user: AuthUser) {
    if (!isBrowser()) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },

  setAccessToken(accessToken: string) {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  clearSession() {
    if (!isBrowser()) return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  },
};
