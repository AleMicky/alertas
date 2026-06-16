'use client';

import { CheckCircle2, CircleOff, Server } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ClientSystem } from '../../types/client-system.types';

interface Props {
  data: ClientSystem[];
}

function MetricItem({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  iconBg,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Server;
  accent: string;
  iconBg: string;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5"
      title={hint}
    >
      <div
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-md sm:size-8',
          iconBg,
        )}
      >
        <Icon className={cn('size-3.5 sm:size-4', accent)} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-base font-semibold tabular-nums leading-none sm:text-lg">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
}

export function ClientSystemsMetrics({ data }: Props) {
  const total = data.length;
  const active = data.filter((item) => item.active).length;
  const inactive = total - active;

  return (
    <div
      className="flex items-stretch overflow-hidden rounded-lg border border-muted/60 bg-card shadow-sm"
      role="group"
      aria-label="Resumen de sistemas cliente"
    >
      <MetricItem
        icon={Server}
        label="Total"
        value={total}
        hint="Sistemas registrados"
        accent="text-primary"
        iconBg="bg-primary/10"
      />
      <div className="w-px shrink-0 self-stretch bg-border" aria-hidden />
      <MetricItem
        icon={CheckCircle2}
        label="Activos"
        value={active}
        hint="Reciben y emiten eventos"
        accent="text-emerald-600 dark:text-emerald-400"
        iconBg="bg-emerald-500/10"
      />
      <div className="w-px shrink-0 self-stretch bg-border" aria-hidden />
      <MetricItem
        icon={CircleOff}
        label="Inactivos"
        value={inactive}
        hint="Pausados o deshabilitados"
        accent="text-amber-600 dark:text-amber-400"
        iconBg="bg-amber-500/10"
      />
    </div>
  );
}
