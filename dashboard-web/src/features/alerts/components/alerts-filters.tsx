'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { AlertAttentionFilter, AlertFilters } from './alert-utils';

interface Props {
  filters: AlertFilters;
  onChange: (filters: AlertFilters) => void;
  resultCount: number;
}

const attentionOptions: {
  value: AlertAttentionFilter;
  label: string;
}[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Sin atender' },
  { value: 'attended', label: 'Atendidas' },
];

export function AlertsFilters({ filters, onChange, resultCount }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })}
          placeholder="Buscar título, evento, sistema o severidad…"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex max-w-full overflow-x-auto rounded-lg border bg-muted/40 p-1">
          {attentionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange({ ...filters, attention: option.value })}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filters.attention === option.value
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
