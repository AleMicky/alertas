'use client';

import { useRouter } from 'next/navigation';

import { NotificationChannelFormPage } from '@/features/notification-channels/components/notification-channel-form-page';
import { useNotificationChannelsMutations } from '@/features/notification-channels/hooks/use-notification-channel-mutations';
import { CreateNotificationChannelDto } from '@/features/notification-channels/notification-channel.schema';

export default function NewNotificationChannelPage() {
  const router = useRouter();
  const { create, isCreating } = useNotificationChannelsMutations();

  const handleSubmit = (values: CreateNotificationChannelDto) => {
    create(values, {
      onSuccess: () => {
        router.push('/notification-channels');
      },
    });
  };

  return (
    <NotificationChannelFormPage
      isSubmitting={isCreating}
      onSubmit={handleSubmit}
    />
  );
}
