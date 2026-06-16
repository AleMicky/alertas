'use client';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { AlertNotification } from '../alert-notification.types';
import {
  formatAlertTime,
  getNotificationErrorMessage,
  getNotificationStatusTone,
  getRelativeTime,
  NOTIFICATION_LOG_GRID,
  shortenId,
} from './alert-utils';

interface Props {
  notification: AlertNotification;
  index: number;
  onSelect?: (notification: AlertNotification) => void;
}

export function NotificationsLogRow({
  notification,
  index,
  onSelect,
}: Props) {
  const statusTone = getNotificationStatusTone(notification.status);
  const timestamp = notification.sentAt ?? notification.createdAt ?? notification.alert?.alertDate;
  const error = getNotificationErrorMessage(notification);
  const isFailed = notification.status?.toUpperCase() === 'FAILED';
  const detailHint = [
    notification.title,
    notification.message,
    notification.target,
    error,
  ]
    .filter(Boolean)
    .join(' — ');

  const RowTag = onSelect ? 'button' : 'div';

  return (
    <RowTag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect ? () => onSelect(notification) : undefined}
      title={detailHint}
      className={cn(
        'grid w-full items-center gap-x-2 border-b border-border/40 px-2 py-1 text-left font-mono text-[11px] leading-none transition-colors',
        NOTIFICATION_LOG_GRID,
        index % 2 === 0 ? 'bg-background' : 'bg-muted/15',
        onSelect && 'group hover:bg-primary/5',
        isFailed && 'bg-destructive/[0.03]',
      )}
    >
      <span className="truncate text-right tabular-nums text-muted-foreground">
        {timestamp ? formatAlertTime(timestamp) : '—'}
      </span>

      <span
        className={cn(
          'inline-flex items-center gap-1 truncate rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide',
          statusTone.badge,
        )}
      >
        <span className={cn('size-1 shrink-0 rounded-full', statusTone.dot)} aria-hidden />
        {notification.status}
      </span>

      <span className="flex min-w-0 items-center gap-1.5 truncate">
        <span className={cn('shrink-0 font-semibold', statusTone.text)}>
          {notification.notificationChannel?.code
            ?? notification.notificationChannel?.name
            ?? 'canal'}
        </span>

        <span className="truncate text-foreground/90">
          {notification.target}
        </span>

        <span className="hidden text-muted-foreground/50 md:inline">·</span>

        <span className="hidden truncate text-muted-foreground md:inline">
          {notification.title}
        </span>

        {notification.alert?.title ? (
          <>
            <span className="hidden text-muted-foreground/50 lg:inline">·</span>
            <span className="hidden truncate text-muted-foreground/80 lg:inline">
              {notification.alert.title}
            </span>
          </>
        ) : null}

        {isFailed && error ? (
          <span className="truncate text-destructive/90">
            · {error}
          </span>
        ) : null}
      </span>

      <span className="truncate text-right text-[10px] text-muted-foreground tabular-nums">
        {timestamp ? getRelativeTime(timestamp) : '—'}
      </span>

      <span className="flex items-center justify-end gap-0.5 truncate text-[10px] text-muted-foreground/70">
        #{shortenId(notification.id, 6)}
        <ChevronRight
          className={cn(
            'size-3 shrink-0',
            onSelect ? 'opacity-0 transition-opacity group-hover:opacity-100' : 'opacity-30',
          )}
        />
      </span>
    </RowTag>
  );
}
