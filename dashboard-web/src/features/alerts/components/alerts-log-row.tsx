'use client';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import {
  ALERT_LOG_GRID,
  formatAlertTime,
  formatNotificationStats,
  getAlertClientSystemCode,
  getAlertEventCode,
  getAlertReference,
  getAlertStatusTone,
  getAlertTitle,
  getRelativeTime,
  isAlertAttended,
  shortenId,
} from './alert-utils';

interface Props {
  alert: Alert;
  isSelected: boolean;
  onSelect: (alert: Alert) => void;
  index: number;
}

export function AlertsLogRow({ alert, isSelected, onSelect, index }: Props) {
  const statusTone = getAlertStatusTone(alert.status);
  const attended = isAlertAttended(alert);
  const reference = getAlertReference(alert);
  const stats = alert.notifications;
  const detailHint = [getAlertTitle(alert), alert.message].filter(Boolean).join(' — ');

  return (
    <button
      type="button"
      onClick={() => onSelect(alert)}
      title={detailHint}
      className={cn(
        'group grid w-full items-center gap-x-2 border-b border-border/40 px-2 py-1 text-left font-mono text-[11px] leading-none transition-colors',
        ALERT_LOG_GRID,
        index % 2 === 0 ? 'bg-background' : 'bg-muted/15',
        'hover:bg-primary/5',
        isSelected && 'bg-primary/8 ring-1 ring-inset ring-primary/25',
      )}
    >
      <span className="truncate text-right tabular-nums text-muted-foreground group-hover:text-foreground">
        {formatAlertTime(alert.alertDate)}
      </span>

      <span
        className={cn(
          'inline-flex items-center gap-1 truncate rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide',
          statusTone.badge,
        )}
      >
        <span className={cn('size-1 shrink-0 rounded-full', statusTone.dot)} aria-hidden />
        {alert.status}
      </span>

      <span className="flex min-w-0 items-center gap-1.5 truncate">
        <span className={cn('shrink-0 font-semibold', statusTone.text)}>
          {getAlertEventCode(alert)}
        </span>

        <span className="truncate font-medium text-foreground/90">
          {getAlertTitle(alert)}
        </span>

        {reference ? (
          <>
            <span className="hidden text-muted-foreground/50 md:inline">·</span>
            <span className="hidden truncate text-muted-foreground md:inline">
              ref {reference}
            </span>
          </>
        ) : null}

        <span className="hidden text-muted-foreground/50 lg:inline">·</span>

        <span className="hidden truncate text-muted-foreground lg:inline">
          {getAlertClientSystemCode(alert)}
        </span>
      </span>

      <span
        className={cn(
          'truncate text-center text-[10px] tabular-nums',
          stats?.failed
            ? 'text-destructive'
            : stats?.pending
              ? 'text-amber-700 dark:text-amber-400'
              : 'text-emerald-600 dark:text-emerald-400',
        )}
        title="Entregas: enviadas/total"
      >
        {formatNotificationStats(alert)}
      </span>

      <span className="truncate text-right text-[10px] text-muted-foreground tabular-nums">
        {getRelativeTime(alert.alertDate)}
      </span>

      <span className="flex items-center justify-end gap-0.5 truncate text-[10px]">
        <span
          className={cn(
            'truncate',
            attended
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400',
          )}
        >
          {attended ? 'ok' : 'pend'}
        </span>
        <span className="text-muted-foreground/70">#{shortenId(alert.id, 6)}</span>
        <ChevronRight className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </button>
  );
}
