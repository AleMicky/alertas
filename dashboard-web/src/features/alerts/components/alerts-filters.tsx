'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { AlertAttentionFilter, AlertFilters } from './alert-utils';

interface Props {
  filters: AlertFilters;
  onChange: (filters: AlertFilters) => void;
  resultCount: number;
  isFetching?: boolean;
}

const attentionOptions: {
  value: AlertAttentionFilter;
  label: string;
}[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'attended', label: 'Atendidas' },
];

export function AlertsFilters({
  filters,
  onChange,
  resultCount,
  isFetching,
}: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative min-w-0 flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })}
          placeholder="Filtrar log…"
          className="h-8 pl-8 font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border bg-muted/30 p-0.5">
          {attentionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange({ ...filters, attention: option.value })}
              className={cn(
                'rounded px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wide transition-colors',
                filters.attention === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {resultCount} líneas
          {isFetching ? ' · sync…' : ''}
        </span>
      </div>
    </div>
  );
}
