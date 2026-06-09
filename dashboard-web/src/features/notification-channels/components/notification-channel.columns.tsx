'use client';

import { ArrowUpDown, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/shared/components/confirm-delete-dialog';
import { StatusBadge } from '@/shared/components/status-badge';

import { notificationChannelTypeOptions } from '../notification-channel.constants';
import { NotificationChannel } from '../notification-channel.types';

interface CreateColumnsProps {
  onEdit: (item: NotificationChannel) => void;
  onDelete: (id: string) => void;
}

const typeLabelByValue = Object.fromEntries(
  notificationChannelTypeOptions.map((option) => [option.value, option.label]),
);

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
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {typeLabelByValue[row.original.type] ?? row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'webhookUrl',
      header: 'Webhook',
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate block" title={row.original.webhookUrl}>
          {row.original.webhookUrl}
        </span>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      cell: ({ row }) => (
        <StatusBadge active={row.original.active} />
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
            >
              <Edit className="mr-1 h-4 w-4" />
              Editar
            </Button>

            <ConfirmDeleteDialog
              title="¿Eliminar canal?"
              description="Esta acción eliminará el canal de notificación."
              onConfirm={() => onDelete(item.id)}
            />
          </div>
        );
      },
    },
  ];
}
