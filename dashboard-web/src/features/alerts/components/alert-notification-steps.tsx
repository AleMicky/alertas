'use client';

import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { AlertNotification } from '../alert-notification.types';
import {
  formatAlertDate,
  getNotificationErrorMessage,
  getNotificationStatusTone,
} from './alert-utils';

interface Props {
  notifications: AlertNotification[];
  isLoading?: boolean;
}

type StepState = 'done' | 'current' | 'error' | 'upcoming';

function StepIcon({ state }: { state: StepState }) {
  if (state === 'done') {
    return <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />;
  }

  if (state === 'error') {
    return <XCircle className="size-5 text-destructive" />;
  }

  if (state === 'current') {
    return <Loader2 className="size-5 animate-spin text-primary" />;
  }

  return <Circle className="size-5 text-muted-foreground/50" />;
}

function getStepState(status: string): StepState {
  const normalized = status.toUpperCase();

  if (normalized === 'SENT') return 'done';
  if (normalized === 'FAILED') return 'error';
  if (normalized === 'PROCESSING') return 'current';

  return 'upcoming';
}

export function AlertNotificationSteps({ notifications, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Cargando notificaciones…
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/10 p-4 text-sm text-muted-foreground">
        No hay notificaciones asociadas a esta alerta.
      </div>
    );
  }

  return (
    <ol className="relative space-y-0">
      {notifications.map((notification, index) => {
        const state = getStepState(notification.status);
        const statusTone = getNotificationStatusTone(notification.status);
        const errorMessage = getNotificationErrorMessage(notification);

        return (
          <li key={notification.id} className="relative flex gap-3 pb-6 last:pb-0 sm:gap-4 sm:pb-8">
            {index < notifications.length - 1 ? (
              <span
                className={cn(
                  'absolute left-[10px] top-6 h-[calc(100%-12px)] w-px',
                  state === 'done'
                    ? 'bg-emerald-500/50'
                    : state === 'error'
                      ? 'bg-destructive/40'
                      : 'bg-border',
                )}
                aria-hidden
              />
            ) : null}

            <div className="relative z-10 mt-0.5 shrink-0">
              <StepIcon state={state} />
            </div>

            <div className="min-w-0 flex-1 space-y-2 rounded-lg border bg-muted/20 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium">
                    {notification.notificationChannel?.name ?? 'Canal'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {notification.target}
                  </p>
                </div>

                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                    statusTone.badge,
                  )}
                >
                  <span className={cn('size-1.5 rounded-full', statusTone.dot)} />
                  {notification.status}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {notification.sentAt
                  ? `Enviada: ${formatAlertDate(notification.sentAt)}`
                  : 'Pendiente de envío'}
              </p>

              {errorMessage ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1.5 text-xs text-destructive">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
