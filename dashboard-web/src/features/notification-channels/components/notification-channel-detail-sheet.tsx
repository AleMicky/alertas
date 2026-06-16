'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Braces, Copy, Edit, ExternalLink, Link2, Radio } from 'lucide-react';
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
import { formatJsonObject } from '@/shared/utils/json-object';
import { formatDate } from '@/shared/utils/format-date';

import { getNotificationChannelPayloadSummary } from '../notification-channel-payload.utils';
import { NotificationChannel } from '../notification-channel.types';

interface Props {
  channel: NotificationChannel | null;
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

async function copyText(label: string, value: string) {
  if (!value.trim()) {
    toast.error(`No hay ${label} para copiar`);
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copiado al portapapeles`);
  } catch {
    toast.error(`No se pudo copiar ${label}`);
  }
}

function JsonBlock({
  title,
  value,
  emptyMessage,
  onCopy,
}: {
  title: string;
  value?: Record<string, unknown>;
  emptyMessage: string;
  onCopy: () => void;
}) {
  const formatted = formatJsonObject(value);
  const keyCount = value ? Object.keys(value).length : 0;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Braces className="size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold">{title}</h3>
          {keyCount > 0 ? (
            <Badge variant="secondary" className="font-mono text-xs">
              {keyCount} clave{keyCount === 1 ? '' : 's'}
            </Badge>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCopy}
          disabled={!formatted}
        >
          <Copy className="mr-1.5 size-4" />
          Copiar
        </Button>
      </div>

      <pre className="max-h-[min(40vh,320px)] overflow-auto rounded-xl border bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-emerald-400 shadow-inner">
        {formatted || emptyMessage}
      </pre>
    </section>
  );
}

export function NotificationChannelDetailSheet({
  channel,
  open,
  onOpenChange,
}: Props) {
  if (!channel) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl" />
      </Sheet>
    );
  }

  const summary = getNotificationChannelPayloadSummary(channel);
  const requiredPreview = summary.requiredList.length
    ? formatJsonObject({ required: summary.requiredList })
    : '';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <SheetHeader className="shrink-0 space-y-4 border-b bg-linear-to-br from-primary/5 via-muted/30 to-background p-6">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <Badge variant="outline" className="gap-1.5 font-normal">
              <Radio className="size-3.5" aria-hidden />
              Canal
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {channel.code}
            </Badge>
            {summary.hasPayload ? (
              <Badge variant="secondary">
                {summary.fieldCount} campo{summary.fieldCount === 1 ? '' : 's'}
              </Badge>
            ) : null}
            {summary.requiredCount > 0 ? (
              <Badge variant="outline">
                {summary.requiredCount} requerido
                {summary.requiredCount === 1 ? '' : 's'}
              </Badge>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <SheetTitle className="text-left text-xl">{channel.name}</SheetTitle>
            {channel.description ? (
              <SheetDescription className="text-left leading-relaxed">
                {channel.description}
              </SheetDescription>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              nativeButton={false}
              className="gap-2"
              render={
                <Link href={`/notification-channels/${channel.id}/edit`} />
              }
            >
              <Edit className="size-4" />
              Editar canal
            </Button>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              className="gap-2"
              render={
                <a
                  href={channel.webhookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="size-4" />
              Abrir webhook
            </Button>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Link2 className="size-4 text-primary" aria-hidden />
              <h3 className="text-sm font-semibold">Configuración</h3>
            </div>

            <dl className="space-y-3 rounded-xl border bg-muted/20 p-4">
              <DetailRow label="Webhook">
                <span className="break-all font-mono text-xs">
                  {channel.webhookUrl}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 gap-1.5 px-2"
                  onClick={() => copyText('Webhook', channel.webhookUrl)}
                >
                  <Copy className="size-3.5" />
                  Copiar URL
                </Button>
              </DetailRow>

              <DetailRow label="Actualizado">
                {formatDate(channel.updatedAt)}
                {channel.updatedBy ? (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    por {channel.updatedBy}
                  </span>
                ) : null}
              </DetailRow>
            </dl>
          </section>

          <Separator />

          <JsonBlock
            title="Body"
            value={channel.payloadExampleJson}
            emptyMessage="Sin body configurado."
            onCopy={() =>
              copyText(
                'Body',
                formatJsonObject(channel.payloadExampleJson),
              )
            }
          />

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Braces className="size-4 text-primary" aria-hidden />
                <h3 className="text-sm font-semibold">payloadSchemaJson</h3>
                {summary.requiredCount > 0 ? (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {summary.requiredCount} requerido
                    {summary.requiredCount === 1 ? '' : 's'}
                  </Badge>
                ) : null}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  copyText('payloadSchemaJson', requiredPreview)
                }
                disabled={!requiredPreview}
              >
                <Copy className="mr-1.5 size-4" />
                Copiar
              </Button>
            </div>

            {summary.requiredList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {summary.requiredList.map((key) => (
                  <Badge key={key} variant="outline" className="font-mono text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin campos obligatorios definidos.
              </p>
            )}

            <pre className="max-h-[min(30vh,220px)] overflow-auto rounded-xl border bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-emerald-400 shadow-inner">
              {requiredPreview || '{\n  "required": []\n}'}
            </pre>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
