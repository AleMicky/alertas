'use client';

import type { ReactNode } from 'react';
import {
  Ban,
  CalendarClock,
  FlaskConical,
  RefreshCcw,
  RotateCcw,
  Trash2,
} from 'lucide-react';

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { LoadingTable } from '@/shared/components';
import { formatDate } from '@/shared/utils/format-date';

import { NotificationRequestDetail } from '../notification-request.types';
import {
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_REQUEST_STATUS_LABELS,
  canCancelNotificationRequest,
  canRequeueNotificationRequest,
  canRetryFailedNotificationRequest,
  extractClientPayloadFromStoredPayload,
  getNotificationRequestStatusClass,
  resolveNotificationRequestChannelCode,
} from '../notification-request.utils';

interface Props {
  detail?: NotificationRequestDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channels: NotificationChannel[];
  clientSystems: ClientSystem[];
  isLoading?: boolean;
  onCancel: (id: string) => void;
  onRequeue: (id: string) => void;
  onRetryFailed: (id: string) => void;
  onRecalculateStatus: (id: string) => void;
  onValidatePayload?: (
    channelCode: string,
    payload: Record<string, unknown>,
  ) => void;
  onDelete?: (id: string) => void;
  isCanceling?: boolean;
  isRequeuing?: boolean;
  isRetryingFailed?: boolean;
  isRecalculating?: boolean;
  isDeleting?: boolean;
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

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-56 overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function NotificationRequestDetailSheet({
  detail,
  open,
  onOpenChange,
  channels,
  clientSystems,
  isLoading,
  onCancel,
  onRequeue,
  onRetryFailed,
  onRecalculateStatus,
  onValidatePayload,
  onDelete,
  isCanceling,
  isRequeuing,
  isRetryingFailed,
  isRecalculating,
  isDeleting,
}: Props) {
  const request = detail?.request;
  const channel = request?.notificationChannelId
    ? channels.find((item) => item.id === request.notificationChannelId)
    : null;
  const system = request
    ? clientSystems.find((item) => item.id === request.clientSystemId)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl"
      >
        {isLoading || !request ? (
          <div className="p-6">
            <LoadingTable />
          </div>
        ) : (
          <>
            <SheetHeader className="space-y-4 border-b bg-gradient-to-br from-primary/5 via-muted/30 to-background p-6">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <Badge
                  className={`text-[10px] ${getNotificationRequestStatusClass(request.status)}`}
                  variant={
                    ['FAILED', 'CANCELED'].includes(request.status)
                      ? 'destructive'
                      : 'default'
                  }
                >
                  {NOTIFICATION_REQUEST_STATUS_LABELS[request.status]}
                </Badge>
                <Badge variant="outline">
                  {NOTIFICATION_PRIORITY_LABELS[request.priority]}
                </Badge>
                {request.archivedAt ? (
                  <Badge variant="secondary">Archivada</Badge>
                ) : null}
              </div>
              <SheetTitle className="text-left text-lg">
                {request.title ?? 'Solicitud de notificación'}
              </SheetTitle>
              <SheetDescription className="text-left font-mono text-xs">
                {request.id}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                {canCancelNotificationRequest(request.status) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => onCancel(request.id)}
                    disabled={isCanceling}
                  >
                    <Ban className="size-3.5" />
                    Cancelar
                  </Button>
                ) : null}
                {canRequeueNotificationRequest(request.status) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => onRequeue(request.id)}
                    disabled={isRequeuing}
                  >
                    <RotateCcw className="size-3.5" />
                    Reencolar
                  </Button>
                ) : null}
                {canRetryFailedNotificationRequest(request.status) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => onRetryFailed(request.id)}
                    disabled={isRetryingFailed}
                  >
                    <RefreshCcw className="size-3.5" />
                    Reintentar fallidos
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => onRecalculateStatus(request.id)}
                  disabled={isRecalculating}
                >
                  <CalendarClock className="size-3.5" />
                  Recalcular estado
                </Button>
                {request.archivedAt && onDelete ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => onDelete(request.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar
                  </Button>
                ) : null}
              </div>

              <dl className="space-y-3 rounded-lg border p-4">
                <DetailRow label="Sistema">
                  {system ? `${system.name} (${system.code})` : request.clientSystemId}
                </DetailRow>
                <DetailRow label="Canal">
                  {channel ? `${channel.name} (${channel.code})` : '—'}
                </DetailRow>
                <DetailRow label="Referencia">
                  {request.externalReference ?? '—'}
                </DetailRow>
                <DetailRow label="Correlation">
                  {request.correlationId ?? '—'}
                </DetailRow>
                <DetailRow label="Idempotency">
                  {request.idempotencyKey ?? '—'}
                </DetailRow>
                <DetailRow label="Solicitada">
                  {formatDate(request.requestedAt)}
                </DetailRow>
                <DetailRow label="Programada">
                  {formatDate(request.scheduledAt)}
                </DetailRow>
                <DetailRow label="Expira">
                  {formatDate(request.expiresAt)}
                </DetailRow>
                <DetailRow label="Mensaje">
                  {request.message ?? '—'}
                </DetailRow>
              </dl>

              <Tabs defaultValue="payload">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="payload">Payload</TabsTrigger>
                  <TabsTrigger value="recipients">
                    Destinatarios ({detail.recipients.length})
                  </TabsTrigger>
                  <TabsTrigger value="deliveries">
                    Deliveries ({detail.deliveries.length})
                  </TabsTrigger>
                  <TabsTrigger value="audits">
                    Auditoría ({detail.audits.length})
                  </TabsTrigger>
                  <TabsTrigger value="attempts">
                    Intentos ({detail.attempts.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="payload" className="space-y-3 pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Payload
                    </p>
                    {onValidatePayload ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1.5 text-xs"
                        onClick={() => {
                          const channelCode = resolveNotificationRequestChannelCode(
                            request.payload,
                            channel?.code,
                          );

                          if (!channelCode) {
                            return;
                          }

                          onValidatePayload(
                            channelCode,
                            extractClientPayloadFromStoredPayload(
                              request.payload,
                            ),
                          );
                        }}
                      >
                        <FlaskConical className="size-3.5" />
                        Validar con AJV
                      </Button>
                    ) : null}
                  </div>
                  <JsonBlock value={request.payload} />
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                      Metadata
                    </p>
                    <JsonBlock value={request.metadata ?? {}} />
                  </div>
                  {detail.attachments.length > 0 ? (
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                        Adjuntos
                      </p>
                      <div className="space-y-2">
                        {detail.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="rounded-md border p-3 text-xs"
                          >
                            <p className="font-medium">{attachment.fileName}</p>
                            <p className="text-muted-foreground">
                              {attachment.mimeType} · {attachment.sizeBytes} bytes
                            </p>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline-offset-2 hover:underline"
                            >
                              {attachment.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="recipients" className="pt-3">
                  <div className="space-y-2">
                    {detail.recipients.map((recipient) => (
                      <div key={recipient.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{recipient.address}</span>
                          <Badge variant="outline">{recipient.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {recipient.type}
                          {recipient.label ? ` · ${recipient.label}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="deliveries" className="pt-3">
                  <div className="space-y-2">
                    {detail.deliveries.map((delivery) => (
                      <div key={delivery.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs">
                            {delivery.id.slice(0, 8)}...
                          </span>
                          <Badge variant="outline">{delivery.status}</Badge>
                        </div>
                        <Separator className="my-2" />
                        <p className="text-xs text-muted-foreground">
                          Intentos: {delivery.attemptCount}
                        </p>
                        {delivery.errorMessage ? (
                          <p className="mt-1 text-xs text-destructive">
                            {delivery.errorMessage}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="audits" className="pt-3">
                  <div className="space-y-2">
                    {detail.audits.map((audit) => (
                      <div key={audit.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span>
                            {audit.fromStatus ?? '—'} → {audit.toStatus}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(audit.changedAt)}
                          </span>
                        </div>
                        {audit.reason ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {audit.reason}
                          </p>
                        ) : null}
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {audit.changedBy ?? 'SYSTEM'}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="attempts" className="pt-3">
                  <div className="space-y-2">
                    {detail.attempts.map((attempt) => (
                      <div key={attempt.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span>
                            Intento #{attempt.attemptNumber}
                          </span>
                          <Badge variant="outline">{attempt.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(attempt.attemptedAt)}
                        </p>
                        {attempt.errorMessage ? (
                          <p className="mt-1 text-xs text-destructive">
                            {attempt.errorMessage}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
