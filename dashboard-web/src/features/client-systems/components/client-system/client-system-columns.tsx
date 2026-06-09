'use client';

import { ArrowUpDown, Edit, Settings } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/shared/components/confirm-delete-dialog';
import { StatusBadge } from '@/shared/components/status-badge';

import { ClientSystem } from '../types/client-system.types';

interface CreateColumnsProps {
  onEdit: (item: ClientSystem) => void;
  onDelete: (id: string) => void;
  onManage: (item: ClientSystem) => void;
}

export function createClientSystemColumns({
  onEdit,
  onDelete,
  onManage,
}: CreateColumnsProps): ColumnDef<ClientSystem>[] {
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
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => (
        <span
          className="max-w-[240px] truncate block text-muted-foreground"
          title={row.original.description}
        >
          {row.original.description || '-'}
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
              variant="secondary"
              size="sm"
              onClick={() => onManage(item)}
            >
              <Settings className="mr-1 h-4 w-4" />
              Configurar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
            >
              <Edit className="mr-1 h-4 w-4" />
              Editar
            </Button>

            <ConfirmDeleteDialog
              title="¿Eliminar sistema cliente?"
              description="Esta acción eliminará el sistema cliente."
              onConfirm={() => onDelete(item.id)}
            />
          </div>
        );
      },
    },
  ];
}
