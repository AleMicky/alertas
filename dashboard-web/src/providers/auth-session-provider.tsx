"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SessionProvider, signOut, useSession } from "next-auth/react";

function SessionErrorHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (
      session?.error === "RefreshAccessTokenError" &&
      pathname !== "/login"
    ) {
      void signOut({ callbackUrl: "/login" });
      router.replace("/login");
    }
  }, [session?.error, pathname, router]);

  return null;
}

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionErrorHandler />
      {children}
    </SessionProvider>
  );
}
