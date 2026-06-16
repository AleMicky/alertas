'use client';

import Link from 'next/link';
import {
  ArrowUpDown,
  Copy,
  Edit,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/shared/components/confirm-delete-dialog';
import { formatJsonObject } from '@/shared/utils/json-object';
import { formatDate } from '@/shared/utils/format-date';

import {
  formatNotificationChannelPayloadPreview,
  getNotificationChannelPayloadSummary,
} from '../notification-channel-payload.utils';
import { NotificationChannel } from '../notification-channel.types';

interface CreateColumnsProps {
  onView: (item: NotificationChannel) => void;
  onDelete: (id: string) => void;
}

function getWebhookHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

async function copyPayloadBody(item: NotificationChannel) {
  const formatted = formatJsonObject(item.payloadExampleJson);

  if (!formatted) {
    toast.error('Este canal no tiene body configurado');
    return;
  }

  try {
    await navigator.clipboard.writeText(formatted);
    toast.success('Body copiado al portapapeles');
  } catch {
    toast.error('No se pudo copiar el body');
  }
}

export function createNotificationChannelColumns({
  onView,
  onDelete,
}: CreateColumnsProps): ColumnDef<NotificationChannel>[] {
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
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[140px]">
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="text-left font-medium transition-colors hover:text-primary"
          >
            {row.original.name}
          </button>
          {row.original.description ? (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {row.original.description}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'webhookUrl',
      header: 'Webhook',
      cell: ({ row }) => {
        const url = row.original.webhookUrl;

        return (
          <div className="flex max-w-[220px] items-center gap-2">
            <span className="truncate text-sm text-muted-foreground" title={url}>
              {getWebhookHost(url)}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              nativeButton={false}
              render={
                <a href={url} target="_blank" rel="noopener noreferrer" />
              }
            >
              <ExternalLink className="size-3.5" />
              <span className="sr-only">Abrir webhook</span>
            </Button>
          </div>
        );
      },
    },
    {
      id: 'payload',
      header: 'Body',
      cell: ({ row }) => {
        const item = row.original;
        const summary = getNotificationChannelPayloadSummary(item);

        if (!summary.hasPayload) {
          return (
            <span className="text-sm text-muted-foreground">Sin body</span>
          );
        }

        return (
          <div className="max-w-[240px] space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="font-mono text-[11px]">
                {summary.fieldCount} campo{summary.fieldCount === 1 ? '' : 's'}
              </Badge>
              {summary.requiredCount > 0 ? (
                <Badge variant="outline" className="font-mono text-[11px]">
                  {summary.requiredCount} req.
                </Badge>
              ) : null}
            </div>
            <p
              className="line-clamp-1 font-mono text-xs text-muted-foreground"
              title={formatNotificationChannelPayloadPreview(item)}
            >
              {formatNotificationChannelPayloadPreview(item)}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs"
                onClick={() => onView(item)}
              >
                <Eye className="size-3.5" />
                Ver
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs"
                onClick={() => copyPayloadBody(item)}
              >
                <Copy className="size-3.5" />
                Copiar
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          <p>{formatDate(row.original.updatedAt)}</p>
          {row.original.updatedBy ? (
            <p className="text-xs">{row.original.updatedBy}</p>
          ) : null}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex justify-end gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onView(item)}
              title="Ver detalle"
            >
              <Eye className="size-4" />
              <span className="sr-only">Ver detalle</span>
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              nativeButton={false}
              render={<Link href={`/notification-channels/${item.id}/edit`} />}
              title="Editar canal"
            >
              <Edit className="size-4" />
              <span className="sr-only">Editar canal</span>
            </Button>

            <ConfirmDeleteDialog
              title="¿Eliminar canal?"
              description={`Se eliminará el canal "${item.name}" y dejará de recibir alertas.`}
              onConfirm={() => onDelete(item.id)}
            />
          </div>
        );
      },
    },
  ];
}
