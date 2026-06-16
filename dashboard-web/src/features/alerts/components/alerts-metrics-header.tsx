'use client';

import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import { getAlertStatusTone, groupAlertsByStatus } from './alert-utils';

interface Props {
  data: Alert[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof BellRing;
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
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        <StatChip
          icon={BellRing}
          label="abiertas"
          value={open}
          tone="bg-amber-500/15 text-amber-700 dark:text-amber-400"
        />
        <StatChip
          icon={AlertTriangle}
          label="notificadas"
          value={notified}
          tone="bg-sky-500/15 text-sky-700 dark:text-sky-400"
        />
        <StatChip
          icon={CheckCircle2}
          label="resueltas"
          value={resolved}
          tone="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        />
        <StatChip
          icon={XCircle}
          label="fallidas"
          value={failed}
          tone="bg-destructive/15 text-destructive"
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
                : 'border-border bg-background text-muted-foreground hover:border-primary/40',
            )}
          >
            todas · {total}
          </button>

          {statusGroups.map(({ status, count }) => {
            const tone = getAlertStatusTone(status);

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
