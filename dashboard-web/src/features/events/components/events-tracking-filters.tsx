'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { EventFilters, EventTrackingFilter } from './event-utils';

interface Props {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
  resultCount: number;
}

const trackingOptions: {
  value: EventTrackingFilter;
  label: string;
}[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'processed', label: 'Procesados' },
];

export function EventsTrackingFilters({
  filters,
  onChange,
  resultCount,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })}
          placeholder="Buscar código, título, mensaje o payload…"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border bg-muted/40 p-1">
          {trackingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange({ ...filters, tracking: option.value })}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filters.tracking === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground tabular-nums">
          {resultCount} resultado{resultCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  );
}
