'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table';

import { NotificationChannel } from '../notification-channel.types';
import { createNotificationChannelColumns } from './notification-channel.columns';

interface Props {
  data: NotificationChannel[];
  onEdit: (item: NotificationChannel) => void;
  onDelete: (id: string) => void;
}

export function NotificationChannelsTable({ data, onEdit, onDelete }: Props) {
  const columns = createNotificationChannelColumns({
    onEdit,
    onDelete,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canales de notificación</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchColumn="name"
          searchPlaceholder="Buscar por nombre..."
        />
      </CardContent>
    </Card>
  );
}
