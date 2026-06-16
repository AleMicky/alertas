'use client';

import type { ReactNode } from 'react';
import { Braces, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { useAlertNotificationsByAlert } from '../hooks/use-alert-notifications-query';
import { Alert } from '../alert.types';
import { AlertNotificationSteps } from './alert-notification-steps';
import {
  formatAlertDate,
  formatNotificationStats,
  getAlertClientSystemCode,
  getAlertEventCode,
  getAlertEventLabel,
  getAlertReference,
  getAlertStatusTone,
  getAlertTitle,
  isAlertAttended,
  shortenId,
} from './alert-utils';

interface Props {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[120px_1fr] sm:items-start">
      <dt className="font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-xs text-foreground">{children}</dd>
    </div>
  );
}

export function AlertDetailSheet({ alert, open, onOpenChange }: Props) {
  const { data: notifications = [], isLoading } = useAlertNotificationsByAlert(
    open ? alert?.id ?? null : null,
  );

  const statusTone = alert ? getAlertStatusTone(alert.status) : null;
  const attended = alert ? isAlertAttended(alert) : false;

  const handleCopyId = async () => {
    if (!alert) return;

    try {
      await navigator.clipboard.writeText(alert.id);
      toast.success('ID copiado');
    } catch {
      toast.error('No se pudo copiar el ID');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {alert ? (
          <>
            <SheetHeader className="space-y-3 border-b bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-1.5 pr-8">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {getAlertEventCode(alert)}
                </Badge>

                {statusTone ? (
                  <span
                    className={cn(
                      'inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide',
                      statusTone.badge,
                    )}
                  >
                    {alert.status}
                  </span>
                ) : null}

                <Badge
                  variant="outline"
                  className={cn(
                    'font-mono text-[10px]',
                    attended
                      ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                      : 'border-amber-500/40 text-amber-800 dark:text-amber-400',
                  )}
                >
                  {attended ? 'atendida' : 'pendiente'}
                </Badge>
              </div>

              <SheetTitle className="text-left text-base leading-snug">
                {getAlertTitle(alert)}
              </SheetTitle>

              <SheetDescription className="text-left text-xs leading-relaxed">
                {alert.message}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-4">
              <section className="space-y-2">
                <h3 className="text-xs font-semibold">Resumen</h3>
                <dl className="space-y-2 rounded-md border bg-muted/20 p-3">
                  <DetailRow label="Origen">
                    {getAlertClientSystemCode(alert)}
                  </DetailRow>
                  <DetailRow label="Referencia">
                    {getAlertReference(alert) ?? '—'}
                  </DetailRow>
                  <DetailRow label="Registrada">
                    {formatAlertDate(alert.alertDate)}
                  </DetailRow>
                  <DetailRow label="Atendida">
                    {attended
                      ? formatAlertDate(alert.attendedAt)
                      : 'Pendiente'}
                  </DetailRow>
                  <DetailRow label="Entregas">
                    <span
                      className={cn(
                        alert.notifications?.failed
                          ? 'text-destructive'
                          : 'text-foreground',
                      )}
                    >
                      {formatNotificationStats(alert)}
                    </span>
                  </DetailRow>
                  <DetailRow label="ID">
                    <div className="flex items-center gap-2">
                      <code className="truncate rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                        #{shortenId(alert.id, 12)}
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={handleCopyId}
                      >
                        <Copy className="size-3.5" />
                      </Button>
                    </div>
                  </DetailRow>
                </dl>
              </section>

              {alert.event ? (
                <>
                  <Separator />
                  <section className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Braces className="size-3.5 text-primary" />
                      <h3 className="text-xs font-semibold">Evento origen</h3>
                    </div>
                    <p className="rounded-md border bg-muted/20 p-2.5 font-mono text-[11px]">
                      {getAlertEventLabel(alert)}
                    </p>
                  </section>
                </>
              ) : null}

              <Separator />

              <section className="space-y-2">
                <h3 className="text-xs font-semibold">
                  Notificaciones ({notifications.length})
                </h3>
                <AlertNotificationSteps
                  notifications={notifications}
                  isLoading={isLoading}
                />
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
