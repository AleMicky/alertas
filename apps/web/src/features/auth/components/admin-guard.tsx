'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { hasRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !hasRole('ADMIN')) {
      router.replace('/');
    }
  }, [hasRole, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Verificando permisos...
      </div>
    );
  }

  if (!hasRole('ADMIN')) {
    return null;
  }

  return <>{children}</>;
}
