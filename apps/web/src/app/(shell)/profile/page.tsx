'use client';

import { useEffect } from 'react';

import {
  ProfileView,
  ProfileViewSkeleton,
} from '@/features/auth/components/profile-view';
import { useProfileQuery } from '@/features/auth/hooks/use-profile-query';
import { useAuth } from '@/providers/auth-provider';
import { PageHeader, QueryErrorState } from '@/shared/components';

export default function ProfilePage() {
  const { user: cachedUser, syncUser } = useAuth();
  const { data, isLoading, isError, error, refetch } = useProfileQuery();

  useEffect(() => {
    if (data) {
      syncUser(data);
    }
  }, [data, syncUser]);

  const profile = data ?? cachedUser;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        title="Perfil"
        description="Consulta tu información y gestiona la seguridad de tu cuenta."
      />

      {isLoading && !profile ? (
        <ProfileViewSkeleton />
      ) : isError && !profile ? (
        <QueryErrorState
          title="No se pudo cargar el perfil"
          error={error}
          onRetry={() => void refetch()}
        />
      ) : profile ? (
        <ProfileView user={profile} />
      ) : null}
    </main>
  );
}
