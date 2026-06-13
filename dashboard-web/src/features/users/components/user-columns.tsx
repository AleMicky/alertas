'use client';

import { ArrowUpDown, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/shared/components/confirm-delete-dialog';
import { StatusBadge } from '@/shared/components/status-badge';
import { normalizeUserRoles, type User } from '../user.types';

interface CreateColumnsProps {
  onEdit: (item: User) => void;
  onDelete: (id: string) => void;
}

export function createUserColumns({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Nombre',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = normalizeUserRoles(row.original.roles);

        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        );
      },
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
              title="¿Eliminar usuario?"
              description="Esta acción eliminará el usuario del sistema."
              onConfirm={() => onDelete(item.id)}
            />
          </div>
        );
      },
    },
  ];
}
