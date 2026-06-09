'use client';

import { Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/shared/components';

import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';

interface CreateColumnsProps {
  onEdit: (item: ClientSystemToken) => void;
  onDelete: (id: string) => void;
}

export function createClientSystemTokenColumns({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<ClientSystemToken>[] {
  return [
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => row.original.description || '-',
    },
    {
      accessorKey: 'token',
      header: 'Token',
      cell: ({ row }) => (
        <span className="max-w-[260px] truncate block" title={row.original.token}>
          {row.original.token}
        </span>
      ),
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expira',
      cell: ({ row }) => row.original.expiresAt || '-',
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="mr-1 h-4 w-4" />
            Editar
          </Button>

          <ConfirmDeleteDialog
            title="¿Eliminar token?"
            description="Esta acción eliminará el token."
            onConfirm={() => onDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];
}
