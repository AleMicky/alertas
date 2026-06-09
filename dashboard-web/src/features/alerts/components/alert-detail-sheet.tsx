'use client';

import type { ReactNode } from 'react';
import { Bell, Copy, Server, ShieldAlert } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { useAlertNotificationsByAlert } from '../hooks/use-alert-notifications-query';
import { Alert } from '../alert.types';
import { AlertNotificationSteps } from './alert-notification-steps';
import {
  formatAlertDate,
  getAlertClientSystemName,
  getAlertEventCode,
  getAlertStatusTone,
  getSeverityBadgeVariant,
  isAlertAttended,
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
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-start">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
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
      toast.success('ID copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar el ID');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl"
      >
        {alert ? (
          <>
            <SheetHeader className="space-y-4 border-b bg-gradient-to-br from-primary/5 via-muted/30 to-background p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <Badge variant="outline" className="font-mono text-xs">
                  {getAlertEventCode(alert)}
                </Badge>

                {statusTone ? (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide',
                      statusTone.badge,
                    )}
                  >
                    <span className={cn('size-1.5 rounded-full', statusTone.dot)} />
                    {alert.status}
                  </span>
                ) : null}

                <Badge variant={getSeverityBadgeVariant(alert.severityLevel?.priority)}>
                  {alert.severityLevel?.name ?? 'Sin severidad'}
                </Badge>
              </div>

              <div className="space-y-2 text-left">
                <SheetTitle className="text-xl leading-snug sm:text-2xl">
                  {alert.title}
                </SheetTitle>
                <SheetDescription className="text-sm leading-relaxed">
                  {alert.message}
                </SheetDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1 font-normal">
                  <Server className="size-3" />
                  {getAlertClientSystemName(alert)}
                </Badge>

                {alert.alertRule?.name ? (
                  <Badge variant="outline" className="gap-1 font-normal">
                    <ShieldAlert className="size-3" />
                    {alert.alertRule.name}
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
                  {attended ? 'Atendida' : 'Sin atender'}
                </Badge>
              </div>
            </SheetHeader>

            <Tabs defaultValue="overview" className="flex flex-1 flex-col">
              <div className="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Detalle</TabsTrigger>
                  <TabsTrigger value="notifications" className="gap-2">
                    <Bell className="size-4" />
                    Notificaciones ({notifications.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-0 space-y-6 p-4 sm:p-6">
                <dl className="space-y-4">
                  <DetailRow label="Fecha alerta">
                    {formatAlertDate(alert.alertDate)}
                  </DetailRow>
                  <DetailRow label="Atendida">
                    {attended
                      ? formatAlertDate(alert.attendedAt)
                      : 'Pendiente de atención'}
                  </DetailRow>
                  <DetailRow label="Evento">
                    <span className="font-mono text-xs">{alert.event?.id ?? alert.eventId ?? '—'}</span>
                  </DetailRow>
                  <DetailRow label="Regla">
                    {alert.alertRule?.name ?? alert.alertRuleId ?? '—'}
                  </DetailRow>
                  <DetailRow label="ID">
                    <div className="flex items-center gap-2">
                      <code className="truncate rounded bg-muted px-2 py-1 font-mono text-xs">
                        {alert.id}
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={handleCopyId}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </DetailRow>
                </dl>

                {alert.event?.message ? (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Mensaje del evento origen
                      </p>
                      <p className="rounded-lg border bg-muted/20 p-3 text-sm">
                        {alert.event.message}
                      </p>
                    </div>
                  </>
                ) : null}
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 p-4 sm:p-6">
                <AlertNotificationSteps
                  notifications={notifications}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
