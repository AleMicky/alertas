'use client';

import { ArrowUpDown, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  formatEventDate,
  formatPayloadJson,
  getEventLogLabel,
  getEventPayload,
  getEventReference,
  getEventTimestamp,
  getEventTypeCode,
  getPayloadPreview,
  getStatusTone,
  isEventProcessed,
  shortenId,
} from './event-utils';

interface CreateColumnsProps {
  onView: (item: Event) => void;
}

export function createEventColumns({
  onView,
}: CreateColumnsProps): ColumnDef<Event>[] {
  return [
    {
      id: 'createdAt',
      accessorFn: (row) => getEventTimestamp(row),
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-7 text-xs"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Fecha
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono text-[11px] tabular-nums">
          {formatEventDate(getEventTimestamp(row.original))}
        </span>
      ),
    },
    {
      id: 'eventType',
      accessorFn: (row) => getEventTypeCode(row),
      header: 'Tipo',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Badge variant="outline" className="font-mono text-[10px] font-normal">
            {getEventTypeCode(row.original)}
          </Badge>
          <p className="max-w-[180px] truncate text-[11px] text-muted-foreground">
            {getEventLogLabel(row.original)}
          </p>
        </div>
      ),
    },
    {
      id: 'clientSystem',
      accessorFn: (row) => row.clientSystem?.name ?? '-',
      header: 'Origen',
      cell: ({ row }) => (
        <span className="font-mono text-[11px]">
          {row.original.clientSystem?.code ?? row.original.clientSystem?.name ?? '-'}
        </span>
      ),
    },
    {
      id: 'reference',
      accessorFn: (row) => getEventReference(row) ?? '-',
      header: 'Ref.',
      cell: ({ row }) => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {getEventReference(row.original) ?? '—'}
        </span>
      ),
    },
    {
      id: 'payload_json',
      header: 'payload',
      accessorFn: (row) => formatPayloadJson(getEventPayload(row)),
      cell: ({ row }) => {
        const payload = getEventPayload(row.original);
        const hasPayload = payload && Object.keys(payload).length > 0;

        if (!hasPayload) {
          return (
            <span className="text-[11px] text-muted-foreground italic">
              —
            </span>
          );
        }

        return (
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="group max-w-[200px] truncate rounded px-1 py-0.5 text-left font-mono text-[10px] text-emerald-700 transition-colors hover:bg-muted dark:text-emerald-400"
          >
            {getPayloadPreview(payload, 48)}
          </button>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const tone = getStatusTone(row.original.status);

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
      id: 'tracking',
      header: 'Seg.',
      cell: ({ row }) => (
        <span
          className={cn(
            'font-mono text-[10px]',
            isEventProcessed(row.original)
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400',
          )}
        >
          {isEventProcessed(row.original) ? 'cerrado' : 'activo'}
        </span>
      ),
    },
    {
      id: 'id',
      accessorFn: (row) => row.id,
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-[10px] text-muted-foreground">
          {shortenId(row.original.id)}
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