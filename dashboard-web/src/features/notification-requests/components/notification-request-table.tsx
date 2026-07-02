'use client';

import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { EmptyState, LoadingTable } from '@/shared/components';
import { formatDate } from '@/shared/utils/format-date';

import { NotificationRequest } from '../notification-request.types';
import {
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_REQUEST_STATUS_LABELS,
  getNotificationRequestStatusClass,
} from '../notification-request.utils';

interface Props {
  items: NotificationRequest[];
  total: number;
  page: number;
  size: number;
  isLoading?: boolean;
  channels: NotificationChannel[];
  clientSystems: ClientSystem[];
  onView: (item: NotificationRequest) => void;
  onPageChange: (page: number) => void;
}

export function NotificationRequestTable({
  items,
  total,
  page,
  size,
  isLoading,
  channels,
  clientSystems,
  onView,
  onPageChange,
}: Props) {
  const channelById = new Map(channels.map((channel) => [channel.id, channel]));
  const systemById = new Map(clientSystems.map((system) => [system.id, system]));
  const totalPages = Math.max(Math.ceil(total / size), 1);

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm">
        <CardHeader className="border-b border-border/50 px-4 py-3">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="px-4 py-3">
          <LoadingTable />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm">
      <CardHeader className="gap-1 border-b border-border/50 px-4 py-3">
        <CardTitle className="text-sm font-semibold">Solicitudes</CardTitle>
        <CardDescription className="text-xs tabular-nums">
          {total} resultado{total === 1 ? '' : 's'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="px-4 py-10">
            <EmptyState
              title="Sin solicitudes"
              description="No hay solicitudes que coincidan con los filtros actuales."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="h-8 px-3">Estado</TableHead>
                    <TableHead className="h-8 px-3">Prioridad</TableHead>
                    <TableHead className="h-8 px-3">Canal</TableHead>
                    <TableHead className="h-8 px-3">Sistema</TableHead>
                    <TableHead className="h-8 px-3">Título</TableHead>
                    <TableHead className="h-8 px-3">Referencia</TableHead>
                    <TableHead className="h-8 px-3">Solicitada</TableHead>
                    <TableHead className="h-8 px-3 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const channel = item.notificationChannelId
                      ? channelById.get(item.notificationChannelId)
                      : null;
                    const channelCode =
                      channel?.code ??
                      (typeof item.payload.channel === 'string'
                        ? item.payload.channel
                        : '—');
                    const system = systemById.get(item.clientSystemId);

                    return (
                      <TableRow
                        key={item.id}
                        className="border-b border-border/40 transition-colors hover:bg-muted/40"
                      >
                        <TableCell className="px-3 py-2">
                          <Badge
                            className={`text-[10px] ${getNotificationRequestStatusClass(item.status)}`}
                            variant={
                              ['FAILED', 'CANCELED'].includes(item.status)
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {NOTIFICATION_REQUEST_STATUS_LABELS[item.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <Badge variant="outline" className="text-[10px]">
                            {NOTIFICATION_PRIORITY_LABELS[item.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-3 py-2 font-mono text-xs">
                          {channelCode}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-xs">
                          {system ? (
                            <div>
                              <p className="font-medium">{system.code}</p>
                              <p className="text-muted-foreground">
                                {system.name}
                              </p>
                            </div>
                          ) : (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {item.clientSystemId.slice(0, 8)}...
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate px-3 py-2 text-sm">
                          {item.title ?? '—'}
                        </TableCell>
                        <TableCell className="max-w-[140px] truncate px-3 py-2 font-mono text-[11px] text-muted-foreground">
                          {item.externalReference ?? item.correlationId ?? '—'}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-xs text-muted-foreground">
                          {formatDate(item.requestedAt)}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 px-2 text-xs"
                            onClick={() => onView(item)}
                          >
                            <Eye className="size-3" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-2 border-t border-border/50 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Página {page} de {totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
