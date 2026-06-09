'use client';

import { EmptyState } from '@/shared/components';

import { Event } from '../event.types';
import { formatEventDay, sortEventsByDateDesc } from './event-utils';
import { EventsTimelineItem } from './events-timeline-item';

interface Props {
  events: Event[];
  selectedId?: string;
  onSelect: (event: Event) => void;
}

function groupByDay(events: Event[]) {
  const sorted = sortEventsByDateDesc(events);
  const groups = new Map<string, Event[]>();

  for (const event of sorted) {
    const key = formatEventDay(event.eventDate);
    const list = groups.get(key) ?? [];
    list.push(event);
    groups.set(key, list);
  }

  return [...groups.entries()];
}

export function EventsTrackingTimeline({
  events,
  selectedId,
  onSelect,
}: Props) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Sin eventos para este filtro"
        description="Prueba otro estado o limpia la búsqueda."
      />
    );
  }

  const dayGroups = groupByDay(events);

  return (
    <div className="relative space-y-8">
      <div
        className="absolute top-2 bottom-2 left-[27px] w-px bg-gradient-to-b from-primary/40 via-border to-transparent"
        aria-hidden
      />

      {dayGroups.map(([day, dayEvents]) => (
        <section key={day} className="relative space-y-4">
          <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/90 py-2 backdrop-blur-sm">
            <span className="flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
              {dayEvents.length}
            </span>
            <h3 className="text-sm font-semibold capitalize text-foreground">
              {day}
            </h3>
          </div>

          <div className="space-y-3 pl-2">
            {dayEvents.map((event) => (
              <EventsTimelineItem
                key={event.id}
                event={event}
                isSelected={selectedId === event.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
