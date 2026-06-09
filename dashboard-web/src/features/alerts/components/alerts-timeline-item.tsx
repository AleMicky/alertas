'use client';

import { ChevronRight, Server, ShieldAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import {
  formatAlertTime,
  getAlertClientSystemName,
  getAlertEventCode,
  getAlertStatusTone,
  getRelativeTime,
  getSeverityAccentClass,
  getSeverityBadgeVariant,
  isAlertAttended,
} from './alert-utils';

interface Props {
  alert: Alert;
  isSelected: boolean;
  onSelect: (alert: Alert) => void;
}

export function AlertsTimelineItem({ alert, isSelected, onSelect }: Props) {
  const statusTone = getAlertStatusTone(alert.status);
  const attended = isAlertAttended(alert);

  return (
    <button
      type="button"
      onClick={() => onSelect(alert)}
      className={cn(
        'group relative w-full rounded-xl border bg-card p-3 text-left shadow-sm transition-all sm:p-4',
        'hover:border-primary/40 hover:shadow-md',
        isSelected && 'border-primary ring-2 ring-primary/20',
      )}
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex w-12 shrink-0 flex-col items-center pt-1 sm:w-14">
          <span
            className={cn(
              'size-3 rounded-full ring-4 ring-background',
              getSeverityAccentClass(alert.severityLevel?.priority),
            )}
          />
          <span className="mt-2 text-center text-[10px] font-medium tabular-nums text-muted-foreground sm:text-[11px]">
            {formatAlertTime(alert.alertDate)}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground sm:text-[11px]">
                  {getAlertEventCode(alert)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getRelativeTime(alert.alertDate)}
                </span>
              </div>
              <h3 className="text-sm font-semibold leading-snug sm:text-base">
                {alert.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {alert.message}
              </p>
            </div>

            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide sm:px-2.5 sm:text-[11px]',
                statusTone.badge,
              )}
            >
              <span className={cn('size-1.5 rounded-full', statusTone.dot)} />
              {alert.status}
            </span>

            <Badge variant={getSeverityBadgeVariant(alert.severityLevel?.priority)}>
              {alert.severityLevel?.name ?? 'Sin severidad'}
            </Badge>

            <Badge variant="outline" className="gap-1 font-normal">
              <Server className="size-3" />
              <span className="max-w-[120px] truncate sm:max-w-none">
                {getAlertClientSystemName(alert)}
              </span>
            </Badge>

            {alert.alertRule?.name ? (
              <Badge variant="outline" className="gap-1 font-normal">
                <ShieldAlert className="size-3" />
                <span className="max-w-[100px] truncate sm:max-w-none">
                  {alert.alertRule.name}
                </span>
              </Badge>
            ) : null}

            <Badge
              variant="outline"
              className={cn(
                'font-normal',
                attended
                  ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                  : 'border-amber-500/40 text-amber-800 dark:text-amber-400',
              )}
            >
              {attended ? 'Atendida' : 'Pendiente'}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
}
