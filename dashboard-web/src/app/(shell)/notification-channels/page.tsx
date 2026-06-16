'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { NotificationChannelsTable } from '@/features/notification-channels/components/notification-channel-table';
import { useNotificationChannelsMutations } from '@/features/notification-channels/hooks/use-notification-channel-mutations';
import { useNotificationChannelsQuery } from '@/features/notification-channels/hooks/use-notification-channel-query';
import { LoadingTable, PageHeader } from '@/shared/components';

export default function NotificationChannelsPage() {
  const { data: notificationChannels, isLoading } = useNotificationChannelsQuery();
  const { remove } = useNotificationChannelsMutations();

  const channels = useMemo(() => notificationChannels ?? [], [notificationChannels]);

  return (
    <main className="space-y-4">
      <PageHeader
        title="Canales de notificación"
        description="Configura los destinos webhook donde se envían las alertas."
        action={
          <Button
            nativeButton={false}
            className="gap-2"
            render={<Link href="/notification-channels/new" />}
          >
            <Plus className="size-4" />
            Nuevo canal
          </Button>
        }
      />

      {isLoading ? (
        <LoadingTable />
      ) : (
        <NotificationChannelsTable
          data={channels}
          onDelete={(id) => remove(id)}
        />
      )}
    </main>
  );
}
