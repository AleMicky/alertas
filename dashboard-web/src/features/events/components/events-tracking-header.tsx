'use client';

import { Activity, CheckCircle2, CircleDashed, Layers } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  getStatusTone,
  groupEventsByStatus,
  isEventPending,
  isEventProcessed,
} from './event-utils';

interface Props {
  data: Event[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Layers;
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 shadow-sm">
      <div
        className={cn(
          'flex size-6 items-center justify-center rounded',
          tone ?? 'bg-muted text-muted-foreground',
        )}
      >
        <Icon className="size-3.5" />
      </div>
      <div className="leading-none">
        <p className="text-sm font-bold tabular-nums">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function EventsTrackingHeader({
  data,
  activeStatus,
  onStatusChange,
}: Props) {
  const pending = data.filter((item) => isEventPending(item)).length;
  const processed = data.filter((item) => isEventProcessed(item)).length;
  const statusGroups = groupEventsByStatus(data);
  const total = data.length;

  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        <StatChip icon={Layers} label="total" value={total} />
        <StatChip
          icon={CircleDashed}
          label="activos"
          value={pending}
          tone="bg-amber-500/15 text-amber-700 dark:text-amber-400"
        />
        <StatChip
          icon={CheckCircle2}
          label="cerrados"
          value={processed}
          tone="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        />
        <StatChip
          icon={Activity}
          label="estados"
          value={statusGroups.length}
          tone="bg-primary/10 text-primary"
        />
      </div>

      {statusGroups.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => onStatusChange('all')}
            className={cn(
              'rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide transition-all',
              activeStatus === 'all'
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            todos · {total}
          </button>

          {statusGroups.map(({ status, count }) => {
            const tone = getStatusTone(status);

            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={cn(
                  'rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide transition-all',
                  activeStatus === status
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
    </div>
  );
}
