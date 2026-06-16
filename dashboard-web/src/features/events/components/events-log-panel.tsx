'use client';

import { CalendarDays } from 'lucide-react';

import { EmptyState } from '@/shared/components';
import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  EVENT_LOG_GRID,
  formatEventDayLabel,
  getEventDayKey,
  getEventTimestamp,
  sortEventsByDateDesc,
} from './event-utils';
import { EventsLogRow } from './events-log-row';

interface Props {
  events: Event[];
  selectedId?: string;
  onSelect: (event: Event) => void;
}

interface DayGroup {
  key: string;
  label: string;
  events: Event[];
}

function groupByDay(events: Event[]): DayGroup[] {
  const sorted = sortEventsByDateDesc(events);
  const groups = new Map<string, DayGroup>();

  for (const event of sorted) {
    const timestamp = getEventTimestamp(event);
    const key = getEventDayKey(timestamp);
    const existing = groups.get(key);

    if (existing) {
      existing.events.push(event);
      continue;
    }

    groups.set(key, {
      key,
      label: formatEventDayLabel(timestamp),
      events: [event],
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
        {count} {count === 1 ? 'evento' : 'eventos'}
      </span>
    </div>
  );
}

export function EventsLogPanel({ events, selectedId, onSelect }: Props) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Sin eventos para este filtro"
        description="Prueba otro estado o limpia la búsqueda."
      />
    );
  }

  const dayGroups = groupByDay(events);
  const showDaySeparators = dayGroups.length > 1;
  let rowIndex = 0;

  return (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm">
      <div
        className={cn(
          'sticky top-0 z-10 grid gap-x-2 border-b bg-muted/90 px-2 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm',
          EVENT_LOG_GRID,
        )}
      >
        <span className="text-right">Hora</span>
        <span>Estado</span>
        <span>Tipo · evento · origen</span>
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
              count={group.events.length}
              showLabel={showDaySeparators}
            />

            {group.events.map((event) => {
              const index = rowIndex;
              rowIndex += 1;

              return (
                <EventsLogRow
                  key={event.id}
                  event={event}
                  index={index}
                  isSelected={selectedId === event.id}
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
