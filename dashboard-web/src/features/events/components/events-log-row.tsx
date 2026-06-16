'use client';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  EVENT_LOG_GRID,
  formatEventTime,
  getEventLogLabel,
  getEventPayload,
  getEventReference,
  getEventTimestamp,
  getEventTypeCode,
  getPayloadPreview,
  getRelativeTime,
  getStatusTone,
  shortenId,
} from './event-utils';

interface Props {
  event: Event;
  isSelected: boolean;
  onSelect: (event: Event) => void;
  index: number;
}

export function EventsLogRow({ event, isSelected, onSelect, index }: Props) {
  const payload = getEventPayload(event);
  const statusTone = getStatusTone(event.status);
  const timestamp = getEventTimestamp(event);
  const reference = getEventReference(event);
  const payloadHint = payload
    ? getPayloadPreview(payload, 180)
    : 'Sin payload — clic para detalle';

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      title={payloadHint}
      className={cn(
        'group grid w-full items-center gap-x-2 border-b border-border/40 px-2 py-1 text-left font-mono text-[11px] leading-none transition-colors',
        EVENT_LOG_GRID,
        index % 2 === 0 ? 'bg-background' : 'bg-muted/15',
        'hover:bg-primary/5',
        isSelected && 'bg-primary/8 ring-1 ring-inset ring-primary/25',
      )}
    >
      <span
        className={cn(
          'truncate text-right tabular-nums text-muted-foreground group-hover:text-foreground',
        )}
      >
        {formatEventTime(timestamp)}
      </span>

      <span
        className={cn(
          'inline-flex items-center gap-1 truncate rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide',
          statusTone.badge,
        )}
      >
        <span
          className={cn('size-1 shrink-0 rounded-full', statusTone.dot)}
          aria-hidden
        />
        {event.status}
      </span>

      <span className="flex min-w-0 items-center gap-1.5 truncate">
        <span
          className={cn('shrink-0 font-semibold', statusTone.text)}
        >
          {getEventTypeCode(event)}
        </span>

        <span className="truncate text-foreground/90">
          {getEventLogLabel(event)}
        </span>

        <span className="hidden text-muted-foreground/50 md:inline">·</span>

        <span className="hidden truncate text-muted-foreground md:inline">
          {event.clientSystem?.code ?? event.clientSystem?.name ?? '—'}
        </span>

        {reference ? (
          <>
            <span className="hidden text-muted-foreground/50 lg:inline">·</span>
            <span className="hidden truncate text-muted-foreground/80 lg:inline">
              ref {reference}
            </span>
          </>
        ) : null}
      </span>

      <span className="truncate text-right text-[10px] text-muted-foreground tabular-nums">
        {getRelativeTime(timestamp)}
      </span>

      <span className="flex items-center justify-end gap-0.5 truncate text-[10px] text-muted-foreground/70">
        <span className="truncate">#{shortenId(event.id, 6)}</span>
        <ChevronRight className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </button>
  );
}
