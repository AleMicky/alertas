'use client';

import { Eye, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/shared/components';
import { StatusBadge } from '@/shared/components/status-badge';

import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';
import {
  formatTokenDate,
  isTokenExpired,
} from './client-system-token.utils';

interface CreateColumnsProps {
  onView: (item: ClientSystemToken) => void;
  onEdit: (item: ClientSystemToken) => void;
  onDelete: (id: string) => void;
}

export function createClientSystemTokenColumns({
  onView,
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<ClientSystemToken>[] {
  return [
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => row.original.description || 'Sin descripción',
    },
    {
      accessorKey: 'token',
      header: 'Referencia',
      cell: ({ row }) => (
        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {row.original.token}
        </code>
      ),
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expira',
      cell: ({ row }) => {
        const expired = isTokenExpired(row.original.expiresAt);

        return (
          <div className="flex items-center gap-2">
            <span>{formatTokenDate(row.original.expiresAt)}</span>
            {expired ? <Badge variant="destructive">Expirado</Badge> : null}
          </div>
        );
      },
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      cell: ({ row }) => {
        const expired = isTokenExpired(row.original.expiresAt);

        return (
          <StatusBadge active={row.original.active && !expired} />
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(row.original)}
          >
            <Eye className="mr-1 h-4 w-4" />
            Detalle
          </Button>

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
            description="Esta acción eliminará el registro del token."
            onConfirm={() => onDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];
}
