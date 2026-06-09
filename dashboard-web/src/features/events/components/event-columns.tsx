'use client';

import { ArrowUpDown, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/shared/components/status-badge';

import { Event } from '../event.types';
import {
  formatEventDate,
  formatPayloadJson,
  getEventPayload,
  getPayloadPreview,
  getSeverityBadgeVariant,
} from './event-utils';

interface CreateColumnsProps {
  onView: (item: Event) => void;
}

export function createEventColumns({
  onView,
}: CreateColumnsProps): ColumnDef<Event>[] {
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
          Evento
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
              {item.code}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'eventType',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.original.eventType}
        </Badge>
      ),
    },
    {
      id: 'clientSystem',
      accessorFn: (row) => row.clientSystem?.name ?? '-',
      header: 'Origen',
      cell: ({ row }) => (
        <div className="min-w-[120px]">
          <p className="text-sm font-medium">
            {row.original.clientSystem?.name ?? '-'}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {row.original.clientSystem?.code ?? ''}
          </p>
        </div>
      ),
    },
    {
      id: 'severityLevel',
      accessorFn: (row) => row.severityLevel?.name ?? '-',
      header: 'Severidad',
      cell: ({ row }) => (
        <Badge
          variant={getSeverityBadgeVariant(row.original.severityLevel?.priority)}
        >
          {row.original.severityLevel?.name ?? '-'}
        </Badge>
      ),
    },
    {
      id: 'payload_json',
      header: 'payload_json',
      accessorFn: (row) => formatPayloadJson(getEventPayload(row)),
      cell: ({ row }) => {
        const payload = getEventPayload(row.original);
        const hasPayload = payload && Object.keys(payload).length > 0;

        if (!hasPayload) {
          return (
            <span className="text-xs text-muted-foreground italic">
              Sin datos
            </span>
          );
        }

        return (
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="group max-w-[220px] rounded-md border bg-muted/40 px-2.5 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted"
          >
            <code className="block truncate font-mono text-[11px] text-foreground/90 group-hover:text-primary">
              {getPayloadPreview(payload)}
            </code>
            <span className="mt-1 block text-[10px] text-muted-foreground group-hover:text-primary">
              Clic para ver completo
            </span>
          </button>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant="secondary" className="uppercase tracking-wide">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'eventDate',
      accessorFn: (row) => row.eventDate,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm tabular-nums">
          {formatEventDate(row.original.eventDate)}
        </span>
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
          variant="outline"
          size="sm"
          onClick={() => onView(row.original)}
        >
          <Eye className="mr-1.5 h-4 w-4" />
          Ver
        </Button>
      ),
    },
  ];
}
