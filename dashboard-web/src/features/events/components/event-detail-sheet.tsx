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
import { StatusBadge } from '@/shared/components/status-badge';
import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import { EventTrackingSteps } from './event-tracking-steps';
import {
  formatEventDate,
  formatPayloadJson,
  getEventPayload,
  getSeverityBadgeVariant,
  getStatusTone,
  isEventProcessed,
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
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-start">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function EventDetailSheet({ event, open, onOpenChange }: Props) {
  const payload = event ? getEventPayload(event) : undefined;
  const statusTone = event ? getStatusTone(event.status) : null;

  const handleCopyPayload = async () => {
    if (!payload) return;

    try {
      await navigator.clipboard.writeText(formatPayloadJson(payload));
      toast.success('payload_json copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar el JSON');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl"
      >
        {event ? (
          <>
            <SheetHeader className="space-y-4 border-b bg-gradient-to-br from-primary/5 via-muted/30 to-background p-6">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <Badge variant="outline" className="font-mono text-xs">
                  {event.code}
                </Badge>
                <Badge variant="outline">{event.eventType}</Badge>
                {statusTone ? (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide',
                      statusTone.badge,
                    )}
                  >
                    {event.status}
                  </span>
                ) : null}
                <StatusBadge active={event.active} />
                <Badge
                  variant="outline"
                  className={cn(
                    isEventProcessed(event)
                      ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                      : 'border-amber-500/40 text-amber-800 dark:text-amber-400',
                  )}
                >
                  {isEventProcessed(event) ? 'Cerrado' : 'En seguimiento'}
                </Badge>
              </div>

              <SheetTitle className="text-left text-xl leading-snug">
                {event.title}
              </SheetTitle>

              <SheetDescription className="text-left text-sm leading-relaxed">
                {event.message}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8 p-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold">Flujo de seguimiento</h3>
                <EventTrackingSteps event={event} />
              </section>

              <Separator />

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Contexto operativo</h3>
                <dl className="space-y-3 rounded-xl border bg-muted/20 p-4">
                  <DetailRow label="Sistema cliente">
                    <span className="font-medium">
                      {event.clientSystem?.name ?? '-'}
                    </span>
                    {event.clientSystem?.code ? (
                      <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                        {event.clientSystem.code}
                      </span>
                    ) : null}
                  </DetailRow>

                  <DetailRow label="Severidad">
                    <Badge
                      variant={getSeverityBadgeVariant(
                        event.severityLevel?.priority,
                      )}
                    >
                      {event.severityLevel?.name ?? '-'}
                    </Badge>
                  </DetailRow>

                  <DetailRow label="Registrado">
                    {formatEventDate(event.eventDate)}
                  </DetailRow>

                  <DetailRow label="Procesado">
                    {event.processedAt
                      ? formatEventDate(event.processedAt)
                      : (
                        <span className="text-amber-700 dark:text-amber-400">
                          Pendiente de procesamiento
                        </span>
                      )}
                  </DetailRow>
                </dl>
              </section>

              <Separator />

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Braces className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-semibold">payload_json</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {payload ? (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {Object.keys(payload).length} claves
                      </Badge>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPayload}
                      disabled={!payload}
                    >
                      <Copy className="mr-1.5 size-4" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <pre className="max-h-[min(45vh,400px)] overflow-auto rounded-xl border bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-emerald-400 shadow-inner">
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
