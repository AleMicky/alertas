'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { NotificationChannelFormSheet } from '@/features/notification-channels/components/notification-channel-form-sheet';
import { NotificationChannelsTable } from '@/features/notification-channels/components/notification-channel-table';
import { useNotificationChannelsMutations } from '@/features/notification-channels/hooks/use-notification-channel-mutations';
import { useNotificationChannelsQuery } from '@/features/notification-channels/hooks/use-notification-channel-query';
import { CreateNotificationChannelDto } from '@/features/notification-channels/notification-channel.schema';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { LoadingTable, PageHeader } from '@/shared/components';

export default function NotificationChannelsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<NotificationChannel | null>(null);

  const { data: notificationChannels, isLoading } = useNotificationChannelsQuery();

  const {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
  } = useNotificationChannelsMutations();

  const isSubmitting = isCreating || isUpdating;
  const channels = useMemo(() => notificationChannels ?? [], [notificationChannels]);

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSubmit = (values: CreateNotificationChannelDto) => {
    if (selected) {
      const { code: _code, ...data } = values;

      update(
        {
          id: selected.id,
          data,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelected(null);
          },
        },
      );

      return;
    }

    create(values, {
      onSuccess: () => {
        setOpen(false);
        setSelected(null);
      },
    });
  };

  return (
    <main className="space-y-4">
      <PageHeader
        title="Canales de notificación"
        description="Configura los destinos webhook donde se envían las alertas."
        action={
          <Button onClick={handleCreate} className="gap-2">
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
          onEdit={(item) => {
            setSelected(item);
            setOpen(true);
          }}
          onDelete={(id) => remove(id)}
        />
      )}

      <NotificationChannelFormSheet
        open={open}
        onOpenChange={setOpen}
        initialData={selected}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
