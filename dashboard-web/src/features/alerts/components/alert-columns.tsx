'use client';

import { ArrowUpDown, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import {
  formatAlertDate,
  formatNotificationStats,
  getAlertClientSystemCode,
  getAlertEventCode,
  getAlertReference,
  getAlertStatusTone,
  getAlertTitle,
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
          className="-ml-3 h-7 text-xs"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Alerta
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="max-w-[240px] space-y-0.5 py-1">
            <p className="text-sm font-medium leading-snug">{getAlertTitle(item)}</p>
            <p className="line-clamp-1 font-mono text-[10px] text-muted-foreground">
              {getAlertEventCode(item)}
              {getAlertReference(item) ? ` · ref ${getAlertReference(item)}` : ''}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const tone = getAlertStatusTone(row.original.status);

        return (
          <span
            className={cn(
              'inline-flex rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase',
              tone.badge,
            )}
          >
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: 'deliveries',
      header: 'Entregas',
      cell: ({ row }) => (
        <span className="font-mono text-[10px] tabular-nums">
          {formatNotificationStats(row.original)}
        </span>
      ),
    },
    {
      id: 'clientSystem',
      header: 'Origen',
      cell: ({ row }) => (
        <span className="font-mono text-[11px]">
          {getAlertClientSystemCode(row.original)}
        </span>
      ),
    },
    {
      accessorKey: 'alertDate',
      header: 'Fecha',
      cell: ({ row }) => (
        <span className="font-mono text-[11px] tabular-nums">
          {formatAlertDate(row.original.alertDate)}
        </span>
      ),
    },
    {
      id: 'attended',
      header: 'Atención',
      cell: ({ row }) => (
        <span
          className={cn(
            'font-mono text-[10px]',
            isAlertAttended(row.original)
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400',
          )}
        >
          {isAlertAttended(row.original) ? 'ok' : 'pend'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={() => onView(row.original)}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];
}
