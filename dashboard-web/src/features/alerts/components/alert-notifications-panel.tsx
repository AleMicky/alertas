'use client';

import { useMemo, useState } from 'react';
import { Mail, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/shared/components';
import { cn } from '@/lib/utils';

import { AlertNotification } from '../alert-notification.types';
import {
  filterNotifications,
  formatAlertDate,
  getNotificationStatusTone,
  groupNotificationsByStatus,
  NotificationFilters,
  sortNotificationsBySentAt,
} from './alert-utils';

interface Props {
  data: AlertNotification[];
}

const defaultFilters: NotificationFilters = {
  search: '',
  status: 'all',
};

export function AlertNotificationsPanel({ data }: Props) {
  const [filters, setFilters] = useState<NotificationFilters>(defaultFilters);

  const filtered = useMemo(
    () => sortNotificationsBySentAt(filterNotifications(data, filters)),
    [data, filters],
  );

  const statusGroups = useMemo(() => groupNotificationsByStatus(data), [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card/80 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Buscar canal, destino o alerta…"
            className="pl-9"
          />
        </div>

        <span className="text-xs text-muted-foreground tabular-nums">
          {filtered.length} notificación{filtered.length === 1 ? '' : 'es'}
        </span>
      </div>

      {statusGroups.length > 0 ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, status: 'all' }))}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              filters.status === 'all'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-muted',
            )}
          >
            Todas ({data.length})
          </button>

          {statusGroups.map(({ status, count }) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilters((current) => ({ ...current, status }))}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors',
                filters.status === status
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:bg-muted',
              )}
            >
              {status.replaceAll('_', ' ')} ({count})
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin notificaciones"
          description="No hay entregas que coincidan con el filtro actual."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((notification) => {
            const statusTone = getNotificationStatusTone(notification.status);

            return (
              <Card
                key={notification.id}
                className="overflow-hidden border-muted/60 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="space-y-3 border-b bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="line-clamp-2 text-sm leading-snug">
                        {notification.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">
                        {notification.message}
                      </CardDescription>
                    </div>
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        statusTone.badge,
                      )}
                    >
                      {notification.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1 font-normal">
                      <Mail className="size-3" />
                      {notification.notificationChannel?.name ?? 'Canal'}
                    </Badge>
                    {notification.alert?.title ? (
                      <Badge variant="secondary" className="max-w-full truncate font-normal">
                        {notification.alert.title}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="truncate text-xs text-muted-foreground">
                    Destino: {notification.target}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {notification.sentAt
                      ? `Enviada ${formatAlertDate(notification.sentAt)}`
                      : 'Pendiente de envío'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
