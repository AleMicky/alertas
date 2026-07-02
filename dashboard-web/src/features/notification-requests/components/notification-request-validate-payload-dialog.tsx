'use client';

import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, ExternalLink, FlaskConical, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { notificationPayloadSchemaService } from '@/features/notification-payload-schemas/notification-payload-schema.service';
import { formatJson } from '@/features/notification-payload-schemas/notification-payload-schema.utils';
import { getApiErrorMessage } from '@/lib/api-response';
import { cn } from '@/lib/utils';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  JsonFormField,
  SelectFormField,
  TanStackForm,
} from '@/shared/components/form';
import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { useNotificationRequestValidatePayload } from '../hooks/use-notification-request-validate-payload';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channels: NotificationChannel[];
  initialChannelCode?: string;
  initialPayload?: Record<string, unknown>;
}

function ActiveSchemaInfo({
  channelCode,
  open,
  channels,
}: {
  channelCode: string;
  open: boolean;
  channels: NotificationChannel[];
}) {
  const channel = channels.find(
    (item) => item.code.toUpperCase() === channelCode.toUpperCase(),
  );

  const {
    data: activeSchema,
    isLoading: isLoadingActive,
    isError: isActiveError,
  } = useQuery({
    queryKey: [QUERY_KEYS.notificationPayloadSchemas, 'active', channelCode],
    queryFn: () =>
      notificationPayloadSchemaService.getActiveByChannelCode(channelCode),
    enabled: open && !!channelCode,
    retry: false,
  });

  const { data: channelSchemas, isLoading: isLoadingSchemas } = useQuery({
    queryKey: [
      QUERY_KEYS.notificationPayloadSchemas,
      'by-channel',
      channel?.id,
    ],
    queryFn: () =>
      notificationPayloadSchemaService.getByChannel(channel!.id),
    enabled: open && !!channel?.id && !activeSchema && !isLoadingActive,
  });

  if (isLoadingActive || isLoadingSchemas) {
    return (
      <p className="text-muted-foreground">Cargando schema activo…</p>
    );
  }

  if (activeSchema) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <FlaskConical className="size-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">Schema activo:</span>
        <span className="font-medium">{activeSchema.name}</span>
        <Badge variant="outline" className="h-5 text-[10px]">
          v{activeSchema.version}
        </Badge>
      </div>
    );
  }

  const inactiveSchemas = (channelSchemas ?? []).filter((schema) => !schema.active);
  const hasInactiveSchemas = inactiveSchemas.length > 0;

  if (hasInactiveSchemas) {
    const payloadSchemasHref = channel
      ? `/payload-schemas?channelId=${channel.id}`
      : '/payload-schemas';

    return (
      <div className="space-y-2 text-destructive">
        <p className="font-medium">
          Hay {inactiveSchemas.length} schema(s) configurado(s), pero ninguno está
          activo.
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          El <strong>proveedor de canal</strong> (webhook en n8n) y el{' '}
          <strong>schema de payload</strong> (JSON Schema para AJV) son cosas
          distintas. Tienes el schema creado; solo falta activarlo.
        </p>
        <p className="text-[11px] text-muted-foreground">
          En Schemas de payload, pulsa <strong>Activar</strong> en la versión{' '}
          v{inactiveSchemas[0]?.version} del canal {channel?.name ?? channelCode}.
        </p>
        <Link
          href={payloadSchemasHref}
          className={cn(
            buttonVariants({
              variant: 'outline',
              size: 'sm',
            }),
            'h-7 gap-1.5 border-destructive/30 text-xs text-destructive hover:bg-destructive/5',
          )}
        >
          <ExternalLink className="size-3.5" />
          Ir a Schemas de payload
        </Link>
      </div>
    );
  }

  if (isActiveError || channelSchemas?.length === 0) {
    return (
      <div className="space-y-1 text-destructive">
        <p className="font-medium">No hay schema activo para este canal.</p>
        <p className="text-[11px] text-muted-foreground">
          Crea un schema en Schemas de payload y actívalo antes de validar.
        </p>
      </div>
    );
  }

  return (
    <p className="text-destructive">No hay schema activo para este canal.</p>
  );
}

function SchemaExamplePrefill({
  channelCode,
  open,
  initialPayload,
  onExampleLoaded,
}: {
  channelCode: string;
  open: boolean;
  initialPayload?: Record<string, unknown>;
  onExampleLoaded: (example: Record<string, unknown>) => void;
}) {
  const { data: activeSchema } = useQuery({
    queryKey: [QUERY_KEYS.notificationPayloadSchemas, 'active', channelCode],
    queryFn: () =>
      notificationPayloadSchemaService.getActiveByChannelCode(channelCode),
    enabled: open && !!channelCode,
    retry: false,
  });

  useEffect(() => {
    if (!open || initialPayload || !activeSchema?.example) {
      return;
    }

    onExampleLoaded(activeSchema.example);
  }, [open, initialPayload, activeSchema?.example, channelCode, onExampleLoaded]);

  return null;
}

export function NotificationRequestValidatePayloadDialog({
  open,
  onOpenChange,
  channels,
  initialChannelCode,
  initialPayload,
}: Props) {
  const { validate, isValidating, result, error, reset } =
    useNotificationRequestValidatePayload();

  const form = useForm({
    defaultValues: {
      channelCode: initialChannelCode ?? '',
      payloadJsonText: initialPayload ? formatJson(initialPayload) : '{\n  \n}',
    },
    onSubmit: async ({ value }) => {
      reset();

      const parsed = JSON.parse(value.payloadJsonText) as unknown;

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('El payload debe ser un objeto JSON');
      }

      validate({
        channelCode: value.channelCode,
        payload: parsed as Record<string, unknown>,
      });
    },
  });

  const handleExampleLoaded = useCallback(
    (example: Record<string, unknown>) => {
      form.setFieldValue('payloadJsonText', formatJson(example));
    },
    [form],
  );

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    form.reset({
      channelCode: initialChannelCode ?? '',
      payloadJsonText: initialPayload
        ? formatJson(initialPayload)
        : '{\n  \n}',
    });
  }, [open, initialChannelCode, initialPayload]);

  const channelOptions = channels.map((channel) => ({
    label: `${channel.name} (${channel.code})`,
    value: channel.code,
  }));

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Probar validación de payload"
    >
      <p className="mb-3 text-xs text-muted-foreground">
        Valida un payload contra el JSON Schema activo del canal usando AJV
        antes de enviar una solicitud de notificación.
      </p>

      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field
            name="channelCode"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Selecciona un canal' : undefined,
            }}
          >
            {(field) => (
              <SelectFormField
                field={field}
                label="Canal"
                placeholder="Seleccionar canal"
                options={channelOptions}
                disabled={isValidating}
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.values.channelCode}>
            {(selectedChannelCode) =>
              selectedChannelCode ? (
                <>
                  <div className="rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-xs">
                    <ActiveSchemaInfo
                      channelCode={selectedChannelCode}
                      open={open}
                      channels={channels}
                    />
                  </div>
                  <SchemaExamplePrefill
                    channelCode={selectedChannelCode}
                    open={open}
                    initialPayload={initialPayload}
                    onExampleLoaded={handleExampleLoaded}
                  />
                </>
              ) : null
            }
          </form.Subscribe>

          <form.Field name="payloadJsonText">
            {(field) => (
              <JsonFormField
                field={field}
                label="Payload JSON"
                description="Solo el cuerpo del payload (sin channel ni target)."
                placeholder='{\n  "to": ["usuario@empresa.com"],\n  "subject": "Hola",\n  "message": "Mensaje"\n}'
                disabled={isValidating}
                className="min-h-[200px] font-mono text-xs"
              />
            )}
          </form.Field>
        </FieldGroup>

        {result ? (
          <div
            className={cn(
              'mt-3 rounded-md border px-3 py-2.5 text-xs',
              result.valid
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
            )}
          >
            <div className="flex items-start gap-2">
              {result.valid ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0" />
              )}
              <div className="min-w-0 space-y-1">
                <p className="font-medium">
                  {result.valid
                    ? 'El payload cumple el schema'
                    : 'El payload no cumple el schema'}
                </p>
                <p className="text-[11px] opacity-80">
                  Canal {result.channelCode} · schema v{result.schemaVersion}
                </p>
                {!result.valid && result.errors.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {result.errors.map((item) => (
                      <li key={item} className="font-mono text-[11px]">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="mt-3 text-xs text-destructive">
            {getApiErrorMessage(error, 'No se pudo validar el payload')}
          </p>
        ) : null}

        <FormSubmitButtons
          isSubmitting={isValidating}
          submitText="Validar con AJV"
          submittingText="Validando..."
          onReset={() => {
            form.reset();
            reset();
          }}
        />
      </TanStackForm>
    </FormDialogLayout>
  );
}
