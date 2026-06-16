'use client';

import { CalendarDays } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { EmptyState } from '@/shared/components';
import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import { AlertNotification } from '../alert-notification.types';
import {
  filterNotifications,
  formatAlertDayLabel,
  getAlertDayKey,
  getNotificationStatusTone,
  groupNotificationsByStatus,
  NOTIFICATION_LOG_GRID,
  NotificationFilters,
  sortNotificationsBySentAt,
} from './alert-utils';
import { NotificationsLogRow } from './notifications-log-row';

interface Props {
  data: AlertNotification[];
  alerts: Alert[];
  onAlertSelect?: (alert: Alert) => void;
}

interface DayGroup {
  key: string;
  label: string;
  notifications: AlertNotification[];
}

const defaultFilters: NotificationFilters = {
  search: '',
  status: 'all',
};

function groupByDay(notifications: AlertNotification[]): DayGroup[] {
  const sorted = sortNotificationsBySentAt(notifications);
  const groups = new Map<string, DayGroup>();

  for (const notification of sorted) {
    const timestamp = notification.sentAt ?? notification.alert?.alertDate;
    const key = getAlertDayKey(timestamp);
    const existing = groups.get(key);

    if (existing) {
      existing.notifications.push(notification);
      continue;
    }

    groups.set(key, {
      key,
      label: formatAlertDayLabel(timestamp),
      notifications: [notification],
    });
  }

  return [...groups.values()];
}

function DaySeparator({
  label,
  count,
  showLabel,
}: {
  label: string;
  count: number;
  showLabel: boolean;
}) {
  if (!showLabel) return null;

  return (
    <div className="flex items-center gap-3 border-b border-border/60 bg-muted/25 px-3 py-2">
      <div className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 shadow-sm">
        <CalendarDays className="size-3 text-muted-foreground" />
        <span className="text-xs font-medium capitalize text-foreground">
          {label}
        </span>
      </div>

      <div className="h-px flex-1 bg-border/70" aria-hidden />

      <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
        {count} {count === 1 ? 'entrega' : 'entregas'}
      </span>
    </div>
  );
}

export function NotificationsLogPanel({
  data,
  alerts,
  onAlertSelect,
}: Props) {
  const [filters, setFilters] = useState<NotificationFilters>(defaultFilters);

  const filtered = useMemo(
    () => sortNotificationsBySentAt(filterNotifications(data, filters)),
    [data, filters],
  );

  const statusGroups = useMemo(() => groupNotificationsByStatus(data), [data]);
  const dayGroups = groupByDay(filtered);
  const showDaySeparators = dayGroups.length > 1;
  let rowIndex = 0;

  const handleNotificationSelect = (notification: AlertNotification) => {
    if (!onAlertSelect) return;

    const alert =
      alerts.find((item) => item.id === notification.alertId)
      ?? alerts.find((item) => item.id === notification.alert?.id);

    if (alert) {
      onAlertSelect(alert);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Filtrar entregas…"
            className="h-8 pl-8 font-mono text-xs"
          />
        </div>

        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {filtered.length} líneas
        </span>
      </div>

      {statusGroups.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, status: 'all' }))}
            className={cn(
              'rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide transition-all',
              filters.status === 'all'
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40',
            )}
          >
            todas · {data.length}
          </button>

          {statusGroups.map(({ status, count }) => {
            const tone = getNotificationStatusTone(status);

            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilters((current) => ({ ...current, status }))}
                className={cn(
                  'rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide transition-all',
                  filters.status === status
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : cn('bg-background hover:border-primary/40', tone.badge),
                )}
              >
                {status.replaceAll('_', ' ')} · {count}
              </button>
            );
          })}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin notificaciones"
          description="No hay entregas que coincidan con el filtro actual."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm">
          <div
            className={cn(
              'sticky top-0 z-10 grid gap-x-2 border-b bg-muted/90 px-2 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm',
              NOTIFICATION_LOG_GRID,
            )}
          >
            <span className="text-right">Hora</span>
            <span>Estado</span>
            <span>Canal · entrega · destino</span>
            <span className="text-right">Δ</span>
            <span className="text-right">ID</span>
          </div>

          <div className="max-h-[min(65vh,680px)] overflow-y-auto">
            {dayGroups.map((group, groupIndex) => (
              <section
                key={group.key}
                className={cn(groupIndex > 0 && 'mt-1 border-t border-border/40')}
              >
                <DaySeparator
                  label={group.label}
                  count={group.notifications.length}
                  showLabel={showDaySeparators}
                />

                {group.notifications.map((notification) => {
                  const index = rowIndex;
                  rowIndex += 1;

                  return (
                    <NotificationsLogRow
                      key={notification.id}
                      notification={notification}
                      index={index}
                      onSelect={onAlertSelect ? handleNotificationSelect : undefined}
                    />
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
