'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/auth.service';
import { authStorage } from '@/features/auth/auth-storage';
import type { AuthUser } from '@/features/auth/auth.types';
import type { LoginDto } from '@/features/auth/auth.schema';

type LoginOptions = {
  redirectTo?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto, options?: LoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  syncUser: (user: AuthUser) => void;
  hasRole: (...roles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(authStorage.getUser());
    setIsLoading(false);
  }, []);

  const syncUser = useCallback((nextUser: AuthUser) => {
    authStorage.setUser(nextUser);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (credentials: LoginDto, options?: LoginOptions) => {
      const response = await authService.login(credentials);
      authStorage.setSession(
        response.accessToken,
        response.refreshToken,
        response.user,
      );
      setUser(response.user);
      router.replace(options?.redirectTo ?? '/');
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Si el token ya expiró, igual limpiamos la sesión local.
    } finally {
      authStorage.clearSession();
      setUser(null);
      router.replace('/login');
    }
  }, [router]);

  const hasRole = useCallback(
    (...roles: string[]) => {
      if (!user?.roles?.length) return false;
      return roles.some((role) => user.roles.includes(role));
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      syncUser,
      hasRole,
    }),
    [user, isLoading, login, logout, syncUser, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
