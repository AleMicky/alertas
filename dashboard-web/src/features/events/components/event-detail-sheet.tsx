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

import { Event } from '../event.types';
import { useAlertsByEventId } from '../hooks/use-alerts-by-event';
import { EventTrackingSteps } from './event-tracking-steps';
import {
  formatEventDate,
  formatPayloadJson,
  getEventLogLabel,
  getEventPayload,
  getEventReference,
  getEventTimestamp,
  getEventTypeCode,
  getEventTypeName,
  getStatusTone,
  isEventProcessed,
  shortenId,
} from './event-utils';

interface Props {
  event: Event | null;
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

export function EventDetailSheet({ event, open, onOpenChange }: Props) {
  const payload = event ? getEventPayload(event) : undefined;
  const statusTone = event ? getStatusTone(event.status) : null;
  const { data: alerts = [], isLoading: alertsLoading } = useAlertsByEventId(
    event?.id ?? null,
  );

  const handleCopyPayload = async () => {
    if (!payload) return;

    try {
      await navigator.clipboard.writeText(formatPayloadJson(payload));
      toast.success('Payload copiado');
    } catch {
      toast.error('No se pudo copiar el JSON');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {event ? (
          <>
            <SheetHeader className="space-y-3 border-b bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-1.5 pr-8">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {getEventTypeCode(event)}
                </Badge>
                {statusTone ? (
                  <span
                    className={cn(
                      'inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide',
                      statusTone.badge,
                    )}
                  >
                    {event.status}
                  </span>
                ) : null}
                <Badge
                  variant="outline"
                  className={cn(
                    'font-mono text-[10px]',
                    isEventProcessed(event)
                      ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                      : 'border-amber-500/40 text-amber-800 dark:text-amber-400',
                  )}
                >
                  {isEventProcessed(event) ? 'cerrado' : 'activo'}
                </Badge>
              </div>

              <SheetTitle className="text-left text-base leading-snug">
                {getEventLogLabel(event)}
              </SheetTitle>

              <SheetDescription className="text-left font-mono text-[11px] leading-relaxed">
                {getEventTypeName(event)} · #{shortenId(event.id, 12)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-4">
              <section className="space-y-2">
                <h3 className="text-xs font-semibold">Flujo</h3>
                <EventTrackingSteps event={event} />
              </section>

              <Separator />

              <section className="space-y-2">
                <h3 className="text-xs font-semibold">Contexto</h3>
                <dl className="space-y-2 rounded-md border bg-muted/20 p-3">
                  <DetailRow label="Sistema">
                    <span className="font-medium">
                      {event.clientSystem?.name ?? '-'}
                    </span>
                    {event.clientSystem?.code ? (
                      <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                        {event.clientSystem.code}
                      </span>
                    ) : null}
                  </DetailRow>

                  <DetailRow label="Referencia">
                    {getEventReference(event) ?? (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </DetailRow>

                  <DetailRow label="Recibido">
                    {formatEventDate(getEventTimestamp(event))}
                  </DetailRow>

                  <DetailRow label="Cerrado">
                    {event.processedAt
                      ? formatEventDate(event.processedAt)
                      : (
                        <span className="text-amber-700 dark:text-amber-400">
                          Pendiente
                        </span>
                      )}
                  </DetailRow>
                </dl>
              </section>

              <Separator />

              <section className="space-y-2">
                <h3 className="text-xs font-semibold">Alertas generadas</h3>
                {alertsLoading ? (
                  <p className="text-[11px] text-muted-foreground">Cargando…</p>
                ) : alerts.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    Sin alertas asociadas a este evento.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {alerts.map((alert) => (
                      <li
                        key={alert.id}
                        className="rounded-md border bg-muted/20 px-2.5 py-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-medium">
                            {alert.title}
                          </p>
                          <span className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground">
                            {alert.status}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground">
                          {alert.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <Separator />

              <section className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Braces className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-semibold">payload_json</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {payload ? (
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {Object.keys(payload).length} claves
                      </Badge>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={handleCopyPayload}
                      disabled={!payload}
                    >
                      <Copy className="mr-1 size-3" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <pre className="max-h-[min(40vh,320px)] overflow-auto rounded-md border bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-emerald-400">
                  {formatPayloadJson(payload)}
                </pre>
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
