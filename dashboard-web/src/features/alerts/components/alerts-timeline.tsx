'use client';

import { EmptyState } from '@/shared/components';

import { Alert } from '../alert.types';
import { formatAlertDay, sortAlertsByDateDesc } from './alert-utils';
import { AlertsTimelineItem } from './alerts-timeline-item';

interface Props {
  alerts: Alert[];
  selectedId?: string;
  onSelect: (alert: Alert) => void;
}

function groupByDay(alerts: Alert[]) {
  const sorted = sortAlertsByDateDesc(alerts);
  const groups = new Map<string, Alert[]>();

  for (const alert of sorted) {
    const key = formatAlertDay(alert.alertDate);
    const list = groups.get(key) ?? [];
    list.push(alert);
    groups.set(key, list);
  }

  return [...groups.entries()];
}

export function AlertsTimeline({ alerts, selectedId, onSelect }: Props) {
  if (alerts.length === 0) {
    return (
      <EmptyState
        title="Sin alertas para este filtro"
        description="Prueba otro estado o limpia la búsqueda."
      />
    );
  }

  const dayGroups = groupByDay(alerts);

  return (
    <div className="relative space-y-6 sm:space-y-8">
      <div
        className="absolute top-2 bottom-2 left-[23px] w-px bg-gradient-to-b from-primary/40 via-border to-transparent sm:left-[27px]"
        aria-hidden
      />

      {dayGroups.map(([day, dayAlerts]) => (
        <section key={day} className="relative space-y-3 sm:space-y-4">
          <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/90 py-2 backdrop-blur-sm">
            <span className="flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
              {dayAlerts.length}
            </span>
            <h3 className="text-sm font-semibold capitalize text-foreground">
              {day}
            </h3>
          </div>

          <div className="space-y-2 pl-1 sm:space-y-3 sm:pl-2">
            {dayAlerts.map((alert) => (
              <AlertsTimelineItem
                key={alert.id}
                alert={alert}
                isSelected={selectedId === alert.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
