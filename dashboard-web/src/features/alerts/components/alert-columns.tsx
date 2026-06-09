'use client';

import { ArrowUpDown, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/shared/components/status-badge';

import { Alert } from '../alert.types';
import {
  formatAlertDate,
  getAlertClientSystemName,
  getAlertEventCode,
  getSeverityBadgeVariant,
  isAlertAttended,
} from './alert-utils';

interface CreateColumnsProps {
  onView: (item: Alert) => void;
}

export function createAlertColumns({
  onView,
}: CreateColumnsProps): ColumnDef<Alert>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Alerta
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="max-w-[280px] space-y-1 py-1">
            <p className="font-medium leading-snug">{item.title}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {item.message}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {getAlertEventCode(item)}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant="outline" className="uppercase">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'severity',
      header: 'Severidad',
      cell: ({ row }) => (
        <Badge variant={getSeverityBadgeVariant(row.original.severityLevel?.priority)}>
          {row.original.severityLevel?.name ?? '—'}
        </Badge>
      ),
    },
    {
      id: 'clientSystem',
      header: 'Sistema',
      cell: ({ row }) => (
        <span className="text-sm">{getAlertClientSystemName(row.original)}</span>
      ),
    },
    {
      accessorKey: 'alertDate',
      header: 'Fecha',
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatAlertDate(row.original.alertDate)}
        </span>
      ),
    },
    {
      id: 'attended',
      header: 'Atención',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            isAlertAttended(row.original)
              ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
              : 'border-amber-500/40 text-amber-800 dark:text-amber-400'
          }
        >
          {isAlertAttended(row.original) ? 'Atendida' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Activo',
      cell: ({ row }) => <StatusBadge active={row.original.active} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => onView(row.original)}
        >
          <Eye className="size-4" />
          Ver
        </Button>
      ),
    },
  ];
}
