'use client';
import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/shared/components/confirm-delete-dialog';
import { StatusBadge } from '@/shared/components/status-badge';

import { SeverityLevel } from '../severity-level.types';

interface CreateColumnsProps {
    onEdit: (item: SeverityLevel) => void;
    onDelete: (id: string) => void;
}

export function createSeverityLevelColumns({
    onEdit,
    onDelete,
}: CreateColumnsProps): ColumnDef<SeverityLevel>[] {
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
            accessorKey: 'priority',
            header: 'Prioridad',
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.priority}
                </Badge>
            ),
        },
        {
            accessorKey: 'attentionTimeMinutes',
            header: 'Tiempo atención',
            cell: ({ row }) => (
                <span>
                    {row.original.attentionTimeMinutes ?? '-'} min
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
                            title="¿Eliminar severidad?"
                            description="Esta acción eliminará el nivel de severidad."
                            onConfirm={() => onDelete(item.id)}
                        />
                    </div>
                );
            },
        },
    ];
}