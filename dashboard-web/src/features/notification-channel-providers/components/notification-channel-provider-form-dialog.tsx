'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { cn } from '@/lib/utils';
import {
  JsonFormField,
  NumberFormField,
  SelectFormField,
  SwitchFormField,
  TanStackForm,
  TextFormField,
} from '@/shared/components/form';

import {
  ProviderAuthType,
  ProviderAuthTypeValue,
} from '../notification-channel-provider.types';
import {
  NotificationChannelProviderFormValues,
  createNotificationChannelProviderSchema,
  defaultNotificationChannelProviderForm,
  providerToFormValues,
  toCreateNotificationChannelProviderDto,
  toUpdateNotificationChannelProviderDto,
} from '../notification-channel-provider.schema';
import { NotificationChannelProvider } from '../notification-channel-provider.types';

const authTypeOptions: Array<{ label: string; value: ProviderAuthTypeValue }> =
  [
    { label: 'Sin autenticación', value: ProviderAuthType.NONE },
    { label: 'API Key', value: ProviderAuthType.API_KEY },
    { label: 'Bearer', value: ProviderAuthType.BEARER },
    { label: 'Basic', value: ProviderAuthType.BASIC },
  ];

const authConfigPlaceholders: Record<ProviderAuthTypeValue, string> = {
  [ProviderAuthType.NONE]: '{}',
  [ProviderAuthType.API_KEY]:
    '{\n  "apiKey": "secret",\n  "headerName": "X-API-Key"\n}',
  [ProviderAuthType.BEARER]: '{\n  "token": "abc123"\n}',
  [ProviderAuthType.BASIC]:
    '{\n  "username": "user",\n  "password": "pass"\n}',
};

const compactInputClassName =
  'h-8 rounded-md border-border/60 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50';

const compactJsonClassName =
  'min-h-[88px] resize-y rounded-md border-border/60 font-mono text-xs leading-relaxed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: NotificationChannelProvider | null;
  channels: NotificationChannel[];
  defaultChannelId?: string;
  onSubmit: (values: NotificationChannelProviderFormValues) => void;
  isSubmitting?: boolean;
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-0.5">
        <h3 className="text-xs font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <FieldGroup className="gap-3.5">{children}</FieldGroup>
    </section>
  );
}

export function NotificationChannelProviderFormDialog({
  open,
  onOpenChange,
  initialData,
  channels,
  defaultChannelId,
  onSubmit,
  isSubmitting,
}: Props) {
  const isEditing = Boolean(initialData);

  const channelOptions = useMemo(
    () =>
      channels.map((channel) => ({
        label: `${channel.name} (${channel.code})`,
        value: channel.id,
      })),
    [channels],
  );

  const form = useForm({
    defaultValues: defaultNotificationChannelProviderForm,
    validators: {
      onSubmit: createNotificationChannelProviderSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(providerToFormValues(initialData));
      return;
    }

    form.reset({
      ...defaultNotificationChannelProviderForm,
      notificationChannelId: defaultChannelId ?? '',
    });
  }, [defaultChannelId, initialData, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <SheetHeader className="shrink-0 space-y-1 border-b border-border/50 bg-muted/20 px-5 py-4 pr-12 text-left">
          <SheetTitle className="text-base font-semibold tracking-tight">
            {isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}
          </SheetTitle>
          <SheetDescription className="text-xs leading-relaxed">
            Configura el webhook, autenticación y reintentos del proveedor.
          </SheetDescription>
        </SheetHeader>

        <TanStackForm form={form} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <FormSection
              title="Información básica"
              description="Identifica el proveedor y define el endpoint de entrega."
            >
              <form.Field name="notificationChannelId">
                {(field) => (
                  <SelectFormField
                    field={field}
                    label="Canal"
                    options={channelOptions}
                    placeholder="Selecciona un canal"
                    disabled={isSubmitting || isEditing}
                    description="Canal de notificación al que pertenece este proveedor."
                  />
                )}
              </form.Field>

              <form.Field name="code">
                {(field) => (
                  <TextFormField
                    field={field}
                    label="Código"
                    placeholder="TELEGRAM_DEFAULT"
                    autoComplete="off"
                    disabled={isSubmitting || isEditing}
                    className={cn(compactInputClassName, 'font-mono')}
                  />
                )}
              </form.Field>

              <form.Field name="name">
                {(field) => (
                  <TextFormField
                    field={field}
                    label="Nombre"
                    placeholder="Telegram principal"
                    autoComplete="off"
                    disabled={isSubmitting}
                    className={compactInputClassName}
                  />
                )}
              </form.Field>

              <form.Field name="webhookUrl">
                {(field) => (
                  <div className="space-y-1">
                    <TextFormField
                      field={field}
                      label="Webhook URL"
                      placeholder="https://hooks.example.com/webhook/abc123-def456"
                      autoComplete="off"
                      disabled={isSubmitting}
                      className={cn(compactInputClassName, 'font-mono text-xs')}
                    />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Endpoint HTTPS que recibirá las notificaciones de alertas.
                    </p>
                  </div>
                )}
              </form.Field>
            </FormSection>

            <Separator className="bg-border/50" />

            <FormSection
              title="Autenticación"
              description="Define cómo se autentican las solicitudes al webhook."
            >
              <form.Field name="authType">
                {(field) => (
                  <SelectFormField
                    field={field}
                    label="Tipo de autenticación"
                    options={authTypeOptions}
                    disabled={isSubmitting}
                    description="Selecciona el método que usa el proveedor para validar las peticiones."
                  />
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.values.authType}>
                {(authType) => (
                  <form.Field name="authConfigJson">
                    {(field) => (
                      <JsonFormField
                        field={field}
                        label="Configuración de autenticación"
                        placeholder={authConfigPlaceholders[authType]}
                        disabled={
                          isSubmitting || authType === ProviderAuthType.NONE
                        }
                        description={
                          authType === ProviderAuthType.NONE
                            ? 'No requiere datos adicionales con autenticación deshabilitada.'
                            : 'Objeto JSON con las credenciales según el tipo seleccionado.'
                        }
                        className={compactJsonClassName}
                      />
                    )}
                  </form.Field>
                )}
              </form.Subscribe>

              <form.Field name="headersJson">
                {(field) => (
                  <JsonFormField
                    field={field}
                    label="Headers adicionales"
                    placeholder='{\n  "X-Custom-Header": "value"\n}'
                    disabled={isSubmitting}
                    description="Opcional. Headers HTTP personalizados que se enviarán en cada solicitud."
                    className={compactJsonClassName}
                  />
                )}
              </form.Field>
            </FormSection>

            <Separator className="bg-border/50" />

            <FormSection
              title="Configuración de entrega"
              description="Controla tiempos de espera y comportamiento de reintentos."
            >
              <div className="grid gap-3.5 sm:grid-cols-2">
                <form.Field name="timeoutSeconds">
                  {(field) => (
                    <div className="space-y-1">
                      <NumberFormField
                        field={field}
                        label="Timeout (segundos)"
                        min={1}
                        disabled={isSubmitting}
                        className={compactInputClassName}
                      />
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Tiempo máximo de espera por respuesta del webhook.
                      </p>
                    </div>
                  )}
                </form.Field>

                <form.Field name="maxAttempts">
                  {(field) => (
                    <div className="space-y-1">
                      <NumberFormField
                        field={field}
                        label="Intentos máximos"
                        min={1}
                        disabled={isSubmitting}
                        className={compactInputClassName}
                      />
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Número de reintentos antes de marcar la entrega como fallida.
                      </p>
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="retryEnabled">
                {(field) => (
                  <SwitchFormField
                    field={field}
                    label="Reintentos habilitados"
                    description="Reintenta automáticamente si la entrega al webhook falla."
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>
            </FormSection>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border/50 bg-muted/20 px-5 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? 'Actualizando...'
                  : 'Guardando...'
                : isEditing
                  ? 'Actualizar proveedor'
                  : 'Guardar proveedor'}
            </Button>
          </div>
        </TanStackForm>
      </SheetContent>
    </Sheet>
  );
}

export {
  toCreateNotificationChannelProviderDto,
  toUpdateNotificationChannelProviderDto,
};
