'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { NotificationChannelFormDialog } from '@/features/notification-channels/components/notification-channel-form-dialog';
import { NotificationChannelsTable } from '@/features/notification-channels/components/notification-channel.table';
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

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSubmit = (values: CreateNotificationChannelDto) => {
    if (selected) {
      update(
        {
          id: selected.id,
          data: values,
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
    <main className="p-6 space-y-4">
      <PageHeader
        title="Canales de notificación"
        description="Configura dónde se envían las alertas."
        action={
          <Button onClick={handleCreate}>
            Nuevo
          </Button>
        }
      />

      {isLoading ? (
        <LoadingTable />
      ) : (
        <NotificationChannelsTable
          data={notificationChannels}
          onEdit={(item) => {
            setSelected(item);
            setOpen(true);
          }}
          onDelete={(id) => remove(id)}
        />
      )}

      <NotificationChannelFormDialog
        open={open}
        onOpenChange={setOpen}
        initialData={selected}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
