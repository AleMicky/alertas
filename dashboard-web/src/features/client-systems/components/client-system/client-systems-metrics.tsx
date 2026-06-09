'use client';

import { CheckCircle2, CircleOff, Server } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ClientSystem } from '../../types/client-system.types';

interface Props {
  data: ClientSystem[];
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Server;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden border-muted/60 shadow-sm">
      <div className={cn('absolute inset-y-0 left-0 w-1', accent)} />
      <CardContent className="flex items-center gap-4 p-4 pl-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted/60">
          <Icon className="size-5 text-foreground/80" />
        </div>
        <div>
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </p>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientSystemsMetrics({ data }: Props) {
  const total = data.length;
  const active = data.filter((item) => item.active).length;
  const inactive = total - active;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard
        icon={Server}
        label="Total"
        value={total}
        hint="Sistemas registrados"
        accent="bg-primary"
      />
      <MetricCard
        icon={CheckCircle2}
        label="Activos"
        value={active}
        hint="Reciben y emiten eventos"
        accent="bg-emerald-500"
      />
      <MetricCard
        icon={CircleOff}
        label="Inactivos"
        value={inactive}
        hint="Pausados o deshabilitados"
        accent="bg-amber-500"
      />
    </div>
  );
}
