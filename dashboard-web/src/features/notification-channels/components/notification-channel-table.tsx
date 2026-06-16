'use client';

import { Radio } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/shared/components';
import { DataTable } from '@/shared/components/data-table';

import { NotificationChannel } from '../notification-channel.types';
import { createNotificationChannelColumns } from './notification-channel-columns';

interface Props {
  data: NotificationChannel[];
  onEdit: (item: NotificationChannel) => void;
  onDelete: (id: string) => void;
}

export function NotificationChannelsTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  const columns = createNotificationChannelColumns({
    onEdit,
    onDelete,
  });

  return (
    <Card className="overflow-hidden border-muted/60 shadow-sm">
      <CardHeader className="border-b bg-linear-to-r from-muted/30 to-transparent">
        <CardTitle className="flex items-center gap-2 text-base">
          <Radio className="size-4" aria-hidden />
          Canales configurados
        </CardTitle>
        <CardDescription>
            {data.length === 0
              ? 'Crea canales webhook para enviar alertas a tus integraciones.'
            : `${data.length} canal${data.length === 1 ? '' : 'es'} registrado${data.length === 1 ? '' : 's'}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {data.length === 0 ? (
          <EmptyState
            title="Sin canales de notificación"
            description="Configura el primer destino webhook para comenzar a enviar alertas."
          />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            searchColumn="name"
            searchPlaceholder="Buscar por nombre o código..."
          />
        )}
      </CardContent>
    </Card>
  );
}
