'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { NotificationChannelFormPage } from '@/features/notification-channels/components/notification-channel-form-page';
import { useNotificationChannelsMutations } from '@/features/notification-channels/hooks/use-notification-channel-mutations';
import { useNotificationChannelsQuery } from '@/features/notification-channels/hooks/use-notification-channel-query';
import { normalizeNotificationChannel } from '@/features/notification-channels/notification-channel-payload.utils';
import { CreateNotificationChannelDto } from '@/features/notification-channels/notification-channel.schema';
import { EmptyState, LoadingTable } from '@/shared/components';

export default function EditNotificationChannelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const channelId = params.id;

  const { data: channels, isLoading } = useNotificationChannelsQuery();
  const { update, isUpdating } = useNotificationChannelsMutations();

  const channel = useMemo(
    () =>
      normalizeNotificationChannel(
        channels.find((item) => item.id === channelId) ?? null,
      ),
    [channels, channelId],
  );

  const handleSubmit = (values: CreateNotificationChannelDto) => {
    if (!channel) return;

    const { code: _code, ...data } = values;

    update(
      { id: channel.id, data },
      {
        onSuccess: () => {
          router.push('/notification-channels');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl">
        <LoadingTable />
      </main>
    );
  }

  if (!channel) {
    return (
      <main className="mx-auto max-w-2xl space-y-4">
        <EmptyState
          title="Canal no encontrado"
          description="El canal solicitado no existe o fue eliminado."
        />
        <div className="flex justify-center">
          <Button nativeButton={false} render={<Link href="/notification-channels" />}>
            Volver al listado
          </Button>
        </div>
      </main>
    );
  }

  return (
    <NotificationChannelFormPage
      initialData={channel}
      isSubmitting={isUpdating}
      onSubmit={handleSubmit}
    />
  );
}
