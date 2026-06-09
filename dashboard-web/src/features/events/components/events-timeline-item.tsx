'use client';

import { Braces, ChevronRight, Server } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  formatEventTime,
  getEventPayload,
  getPayloadPreview,
  getRelativeTime,
  getSeverityAccentClass,
  getSeverityBadgeVariant,
  getStatusTone,
  isEventProcessed,
} from './event-utils';

interface Props {
  event: Event;
  isSelected: boolean;
  onSelect: (event: Event) => void;
}

export function EventsTimelineItem({ event, isSelected, onSelect }: Props) {
  const payload = getEventPayload(event);
  const hasPayload = Boolean(payload && Object.keys(payload).length > 0);
  const processed = isEventProcessed(event);
  const statusTone = getStatusTone(event.status);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={cn(
        'group relative w-full rounded-xl border bg-card p-4 text-left shadow-sm transition-all',
        'hover:border-primary/40 hover:shadow-md',
        isSelected && 'border-primary ring-2 ring-primary/20',
      )}
    >
      <div className="flex gap-4">
        <div className="flex w-14 shrink-0 flex-col items-center pt-1">
          <span
            className={cn(
              'size-3 rounded-full ring-4 ring-background',
              getSeverityAccentClass(event.severityLevel?.priority),
            )}
          />
          <span className="mt-2 text-center text-[11px] font-medium tabular-nums text-muted-foreground">
            {formatEventTime(event.eventDate)}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {event.code}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getRelativeTime(event.eventDate)}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-snug">
                {event.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {event.message}
              </p>
            </div>

            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide',
                statusTone.badge,
              )}
            >
              <span className={cn('size-1.5 rounded-full', statusTone.dot)} />
              {event.status}
            </span>

            <Badge variant={getSeverityBadgeVariant(event.severityLevel?.priority)}>
              {event.severityLevel?.name ?? 'Sin severidad'}
            </Badge>

            <Badge variant="outline" className="gap-1 font-normal">
              <Server className="size-3" />
              {event.clientSystem?.name ?? '—'}
            </Badge>

            <Badge
              variant="outline"
              className={cn(
                'font-normal',
                processed
                  ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                  : 'border-amber-500/40 text-amber-800 dark:text-amber-400',
              )}
            >
              {processed ? 'Procesado' : 'En seguimiento'}
            </Badge>
          </div>

          {hasPayload ? (
            <div className="rounded-lg border bg-zinc-950/95 px-3 py-2 dark:bg-zinc-950">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-500/90">
                <Braces className="size-3" />
                payload_json
              </div>
              <code className="block truncate font-mono text-[11px] text-emerald-400/95">
                {getPayloadPreview(payload, 96)}
              </code>
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
