'use client';

import { ArrowUpDown, Edit } from 'lucide-react';
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
        <span className="min-w-[140px] font-medium">{row.original.name}</span>
      ),
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
          <div className="flex justify-end gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(item)}
              title="Editar canal"
            >
              <Edit className="size-4" />
              <span className="sr-only">Editar canal</span>
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
