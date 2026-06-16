'use client';

import { ArrowUpDown, Edit, ExternalLink } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/shared/components/confirm-delete-dialog';
import { formatDate } from '@/shared/utils/format-date';

import { NotificationChannel } from '../notification-channel.types';

interface CreateColumnsProps {
  onEdit: (item: NotificationChannel) => void;
  onDelete: (id: string) => void;
}

function getWebhookHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function createNotificationChannelColumns({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<NotificationChannel>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[140px]">
          <p className="font-medium">{row.original.name}</p>
          {row.original.description ? (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {row.original.description}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'webhookUrl',
      header: 'Webhook',
      cell: ({ row }) => {
        const url = row.original.webhookUrl;

        return (
          <div className="flex max-w-[260px] items-center gap-2">
            <span className="truncate text-sm text-muted-foreground" title={url}>
              {getWebhookHost(url)}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              nativeButton={false}
              render={
                <a href={url} target="_blank" rel="noopener noreferrer" />
              }
            >
              <ExternalLink className="size-3.5" />
              <span className="sr-only">Abrir webhook</span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          <p>{formatDate(row.original.updatedAt)}</p>
          {row.original.updatedBy ? (
            <p className="text-xs">{row.original.updatedBy}</p>
          ) : null}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
              <Edit className="mr-1 h-4 w-4" />
              Editar
            </Button>

            <ConfirmDeleteDialog
              title="¿Eliminar canal?"
              description={`Se eliminará el canal "${item.name}" y dejará de recibir alertas.`}
              onConfirm={() => onDelete(item.id)}
            />
          </div>
        );
      },
    },
  ];
}
