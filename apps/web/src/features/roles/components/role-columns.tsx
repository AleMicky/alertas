'use client';

import { ArrowUpDown, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/shared/components/confirm-delete-dialog';
import { StatusBadge } from '@/shared/components/status-badge';
import type { Role } from '../role.types';

interface CreateColumnsProps {
  onEdit: (item: Role) => void;
  onDelete: (id: string) => void;
}

export function createRoleColumns({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<Role>[] {
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
        <Badge variant="outline">{row.original.code}</Badge>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge active={row.original.active ?? true} />,
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
              title="¿Eliminar rol?"
              description="Esta acción eliminará el rol del catálogo."
              onConfirm={() => onDelete(item.id)}
            />
          </div>
        );
      },
    },
  ];
}
