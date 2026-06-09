'use client';

import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import { groupAlertsByStatus } from './alert-utils';

interface Props {
  data: Alert[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
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
  icon: typeof BellRing;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden border-muted/60 shadow-sm">
      <div className={cn('absolute inset-y-0 left-0 w-1', accent)} />
      <CardContent className="flex items-center gap-3 p-4 pl-5 sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 sm:size-11">
          <Icon className="size-4 text-foreground/80 sm:size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
            {value}
          </p>
          <p className="truncate text-sm font-medium">{label}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function countByStatus(alerts: Alert[], status: string) {
  return alerts.filter((item) => item.status === status).length;
}

export function AlertsMetricsHeader({
  data,
  activeStatus,
  onStatusChange,
}: Props) {
  const total = data.length;
  const open = countByStatus(data, 'OPEN');
  const notified = countByStatus(data, 'NOTIFIED');
  const resolved = countByStatus(data, 'RESOLVED');
  const failed = countByStatus(data, 'FAILED');
  const statusGroups = groupAlertsByStatus(data);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <MetricCard
          icon={BellRing}
          label="Abiertas"
          value={open}
          hint="Requieren seguimiento operativo"
          accent="bg-amber-500"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Notificadas"
          value={notified}
          hint="Enviadas a canales configurados"
          accent="bg-sky-500"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Resueltas"
          value={resolved}
          hint="Ciclo de alerta completado"
          accent="bg-emerald-500"
        />
        <MetricCard
          icon={XCircle}
          label="Fallidas"
          value={failed}
          hint="Error en entrega o procesamiento"
          accent="bg-destructive"
        />
      </div>

      {statusGroups.length > 0 ? (
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">Filtrar por estado</p>
              <p className="text-xs text-muted-foreground">
                {total} alerta{total === 1 ? '' : 's'} en total
              </p>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              <button
                type="button"
                onClick={() => onStatusChange('all')}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  activeStatus === 'all'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted',
                )}
              >
                Todas ({total})
              </button>

              {statusGroups.map(({ status, count }) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(status)}
                  className={cn(
                    'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors',
                    activeStatus === status
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-muted',
                  )}
                >
                  {status.replaceAll('_', ' ')} ({count})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
