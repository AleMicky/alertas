'use client';

import { CalendarDays } from 'lucide-react';

import { EmptyState } from '@/shared/components';
import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import {
  ALERT_LOG_GRID,
  formatAlertDayLabel,
  getAlertDayKey,
  sortAlertsByDateDesc,
} from './alert-utils';
import { AlertsLogRow } from './alerts-log-row';

interface Props {
  alerts: Alert[];
  selectedId?: string;
  onSelect: (alert: Alert) => void;
}

interface DayGroup {
  key: string;
  label: string;
  alerts: Alert[];
}

function groupByDay(alerts: Alert[]): DayGroup[] {
  const sorted = sortAlertsByDateDesc(alerts);
  const groups = new Map<string, DayGroup>();

  for (const alert of sorted) {
    const key = getAlertDayKey(alert.alertDate);
    const existing = groups.get(key);

    if (existing) {
      existing.alerts.push(alert);
      continue;
    }

    groups.set(key, {
      key,
      label: formatAlertDayLabel(alert.alertDate),
      alerts: [alert],
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
        {count} {count === 1 ? 'alerta' : 'alertas'}
      </span>
    </div>
  );
}

export function AlertsLogPanel({ alerts, selectedId, onSelect }: Props) {
  if (alerts.length === 0) {
    return (
      <EmptyState
        title="Sin alertas para este filtro"
        description="Prueba otro estado o limpia la búsqueda."
      />
    );
  }

  const dayGroups = groupByDay(alerts);
  const showDaySeparators = dayGroups.length > 1;
  let rowIndex = 0;

  return (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm">
      <div
        className={cn(
          'sticky top-0 z-10 grid gap-x-2 border-b bg-muted/90 px-2 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm',
          ALERT_LOG_GRID,
        )}
      >
        <span className="text-right">Hora</span>
        <span>Estado</span>
        <span>Tipo · alerta · ref · origen</span>
        <span className="text-center">Entregas</span>
        <span className="text-right">Δ</span>
        <span className="text-right">ID</span>
      </div>

      <div className="max-h-[min(75vh,780px)] overflow-y-auto">
        {dayGroups.map((group, groupIndex) => (
          <section
            key={group.key}
            className={cn(groupIndex > 0 && 'mt-1 border-t border-border/40')}
          >
            <DaySeparator
              label={group.label}
              count={group.alerts.length}
              showLabel={showDaySeparators}
            />

            {group.alerts.map((alert) => {
              const index = rowIndex;
              rowIndex += 1;

              return (
                <AlertsLogRow
                  key={alert.id}
                  alert={alert}
                  index={index}
                  isSelected={selectedId === alert.id}
                  onSelect={onSelect}
                />
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
