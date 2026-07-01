'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { Braces, Sparkles, Wand2 } from 'lucide-react';

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
  TanStackForm,
  TextFormField,
  TextareaFormField,
} from '@/shared/components/form';

import {
  NotificationPayloadSchemaFormValues,
  createNotificationPayloadSchemaFormSchema,
  defaultNotificationPayloadSchemaForm,
  schemaToFormValues,
} from '../notification-payload-schema.schema';
import { NotificationPayloadSchema } from '../notification-payload-schema.types';
import {
  DEFAULT_SCHEMA_JSON_TEXT,
  buildExampleFromRequiredFields,
  formatJson,
  formatRequiredFieldsText,
  getRequiredFieldsFromSchema,
  parseJsonObject,
  parseRequiredFieldsText,
} from '../notification-payload-schema.utils';

const compactInputClassName =
  'h-8 rounded-md border-border/60 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50';

const compactJsonClassName =
  'min-h-[140px] resize-y rounded-md border-border/60 font-mono text-xs leading-relaxed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: NotificationPayloadSchema | null;
  channels: NotificationChannel[];
  defaultChannelId?: string;
  onSubmit: (values: NotificationPayloadSchemaFormValues) => void;
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

export function NotificationPayloadSchemaFormDialog({
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
    defaultValues: defaultNotificationPayloadSchemaForm,
    validators: {
      onSubmit: createNotificationPayloadSchemaFormSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(schemaToFormValues(initialData));
      return;
    }

    form.reset({
      ...defaultNotificationPayloadSchemaForm,
      notificationChannelId: defaultChannelId ?? '',
      schemaJsonText: DEFAULT_SCHEMA_JSON_TEXT,
      requiredFieldsText: 'to, subject, message',
    });
  }, [defaultChannelId, initialData, open]);

  const syncRequiredFromSchema = () => {
    const schemaText = form.getFieldValue('schemaJsonText');

    try {
      const schemaJson = parseJsonObject(schemaText, 'schemaJson');
      const requiredFields = getRequiredFieldsFromSchema(schemaJson);

      form.setFieldValue(
        'requiredFieldsText',
        formatRequiredFieldsText(requiredFields),
      );
    } catch {
      // La validación del formulario mostrará el error al enviar.
    }
  };

  const generateExample = () => {
    const requiredFields = parseRequiredFieldsText(
      form.getFieldValue('requiredFieldsText'),
    );

    if (requiredFields.length === 0) {
      return;
    }

    form.setFieldValue(
      'exampleJsonText',
      formatJson(buildExampleFromRequiredFields(requiredFields)),
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <SheetHeader className="shrink-0 space-y-1 border-b border-border/50 bg-muted/20 px-5 py-4 pr-12 text-left">
          <SheetTitle className="text-base font-semibold tracking-tight">
            {isEditing ? 'Editar schema de payload' : 'Nuevo schema de payload'}
          </SheetTitle>
          <SheetDescription className="text-xs leading-relaxed">
            Define el JSON Schema, campos requeridos y ejemplo para un canal.
          </SheetDescription>
        </SheetHeader>

        <TanStackForm form={form} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <FormSection
              title="Información básica"
              description="Asocia el schema a un canal y define su versión."
            >
              <form.Field name="notificationChannelId">
                {(field) => (
                  <SelectFormField
                    field={field}
                    label="Canal"
                    options={channelOptions}
                    placeholder="Selecciona un canal"
                    disabled={isSubmitting || isEditing}
                    description="Canal de notificación al que pertenece este schema."
                  />
                )}
              </form.Field>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <form.Field name="name">
                  {(field) => (
                    <TextFormField
                      field={field}
                      label="Nombre"
                      placeholder="email-default"
                      autoComplete="off"
                      disabled={isSubmitting || isEditing}
                      className={compactInputClassName}
                    />
                  )}
                </form.Field>

                <form.Field name="version">
                  {(field) => (
                    <div className="space-y-1">
                      <NumberFormField
                        field={field}
                        label="Versión"
                        min={1}
                        disabled={isSubmitting || isEditing}
                        className={compactInputClassName}
                      />
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Opcional. Si no indicas versión, se asigna automáticamente.
                      </p>
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="description">
                {(field) => (
                  <TextareaFormField
                    field={field}
                    label="Descripción"
                    placeholder="Schema para notificaciones de correo"
                    disabled={isSubmitting}
                    className="min-h-[72px] resize-y rounded-md border-border/60 text-sm"
                  />
                )}
              </form.Field>
            </FormSection>

            <Separator className="bg-border/50" />

            <FormSection
              title="JSON Schema"
              description="Debe ser un JSON Schema válido. El array required debe coincidir con los campos requeridos."
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  disabled={isSubmitting}
                  onClick={syncRequiredFromSchema}
                >
                  <Wand2 className="size-3" />
                  Sincronizar required
                </Button>
              </div>

              <form.Field name="schemaJsonText">
                {(field) => (
                  <JsonFormField
                    field={field}
                    label="schemaJson"
                    placeholder={DEFAULT_SCHEMA_JSON_TEXT}
                    disabled={isSubmitting}
                    className={compactJsonClassName}
                  />
                )}
              </form.Field>

              <form.Field name="requiredFieldsText">
                {(field) => (
                  <div className="space-y-1">
                    <TextFormField
                      field={field}
                      label="Campos requeridos"
                      placeholder="to, subject, message"
                      disabled={isSubmitting}
                      className={cn(compactInputClassName, 'font-mono text-xs')}
                    />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Separados por coma. Deben coincidir exactamente con
                      schemaJson.required.
                    </p>
                  </div>
                )}
              </form.Field>
            </FormSection>

            <Separator className="bg-border/50" />

            <FormSection
              title="Ejemplo de payload"
              description="Opcional. Útil para documentar el formato esperado."
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  disabled={isSubmitting}
                  onClick={generateExample}
                >
                  <Sparkles className="size-3" />
                  Generar ejemplo
                </Button>
              </div>

              <form.Field name="exampleJsonText">
                {(field) => (
                  <JsonFormField
                    field={field}
                    label="example"
                    placeholder='{\n  "to": ["usuario@empresa.com"],\n  "subject": "",\n  "message": ""\n}'
                    disabled={isSubmitting}
                    description="Objeto JSON de ejemplo que cumple el schema."
                    className={compactJsonClassName}
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
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
              <Braces className="size-3.5" />
              {isSubmitting
                ? isEditing
                  ? 'Actualizando...'
                  : 'Guardando...'
                : isEditing
                  ? 'Actualizar schema'
                  : 'Guardar schema'}
            </Button>
          </div>
        </TanStackForm>
      </SheetContent>
    </Sheet>
  );
}
