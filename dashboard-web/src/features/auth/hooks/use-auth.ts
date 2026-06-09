"use client";

import { signOut, useSession } from "next-auth/react";

type AuthUser = {
  nombreCompleto?: string;
  userName?: string;
  roles?: string[];
};

export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | undefined = session?.user
    ? {
        nombreCompleto: session.user.name ?? undefined,
        userName: session.user.email ?? session.user.name ?? undefined,
        roles: session.roles ?? [],
      }
    : undefined;

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isLoggingOut: false,
    logout: async () => {
      await signOut({ callbackUrl: "/login" });
    },
  };
}
