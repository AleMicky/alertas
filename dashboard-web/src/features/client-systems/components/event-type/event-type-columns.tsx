'use client';

import { ArrowUpDown, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/shared/components';

import { EventType } from '@/features/client-systems/types/event-type.types';

interface CreateColumnsProps {
  onEdit: (item: EventType) => void;
  onDelete: (id: string) => void;
}

export function createEventTypeColumns({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<EventType>[] {
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
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorFn: (row) => row.severityLevel?.name ?? '-',
      id: 'severity',
      header: 'Severidad',
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
            title="¿Eliminar tipo de evento?"
            description="Esta acción eliminará el tipo de evento."
            onConfirm={() => onDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];
}
