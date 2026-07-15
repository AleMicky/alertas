'use client';

import { FormEvent, ReactNode, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Braces, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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
import {
  JsonFormField,
  NumberFormField,
  SelectFormField,
  SwitchFormField,
  TextFormField,
  TextareaFormField,
} from '@/shared/components/form';

import { SchemaFieldsBuilder } from './schema-fields-builder';
import {
  NotificationPayloadSchemaFormValues,
  createNotificationPayloadSchemaFormSchema,
  defaultNotificationPayloadSchemaForm,
  schemaToFormValues,
  updateNotificationPayloadSchemaFormSchema,
} from '../notification-payload-schema.schema';
import { NotificationPayloadSchema } from '../notification-payload-schema.types';
import {
  SchemaBuilderState,
  buildExampleFromBuilderState,
  createDefaultSchemaBuilderState,
  ensureSchemaFieldOrder,
  formatJson,
  formatRequiredFieldsText,
  getRequiredFieldsFromSchema,
  parseJsonObject,
  parseRequiredFieldsText,
  schemaJsonToBuilderState,
  syncFormTextsFromBuilderState,
} from '../notification-payload-schema.utils';

const compactInputClassName =
  'h-8 rounded-md border-border/60 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50';

const compactJsonClassName =
  'min-h-[180px] resize-y rounded-md border-border/60 font-mono text-xs leading-relaxed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50';

type EditorMode = 'visual' | 'json';

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

function getInitialBuilderState(
  initialData?: NotificationPayloadSchema | null,
): SchemaBuilderState {
  if (!initialData) {
    return createDefaultSchemaBuilderState();
  }

  return schemaJsonToBuilderState(
    initialData.schemaJson,
    initialData.requiredFields ?? [],
  );
}

function getInitialFormValues(
  initialData: NotificationPayloadSchema | null | undefined,
  defaultChannelId: string | undefined,
  builder: SchemaBuilderState,
): NotificationPayloadSchemaFormValues {
  if (initialData) {
    return schemaToFormValues(initialData);
  }

  const synced = syncFormTextsFromBuilderState(builder);

  return {
    ...defaultNotificationPayloadSchemaForm,
    notificationChannelId: defaultChannelId ?? '',
    schemaJsonText: synced.schemaJsonText,
    requiredFieldsText: synced.requiredFieldsText,
    active: true,
  };
}

/** Une la vista activa (interfaz o JSON) en los textos que consume la API. */
function resolveFormValuesForSubmit(
  values: NotificationPayloadSchemaFormValues,
  editorMode: EditorMode,
  builderState: SchemaBuilderState,
): NotificationPayloadSchemaFormValues {
  if (editorMode === 'visual') {
    return {
      ...values,
      ...syncFormTextsFromBuilderState(builderState),
    };
  }

  // Modo JSON: sincroniza required + preserva orden de campos (jsonb no lo guarda solo).
  try {
    const schemaJson = ensureSchemaFieldOrder(
      parseJsonObject(values.schemaJsonText, 'schemaJson'),
    );
    const schemaRequired = getRequiredFieldsFromSchema(schemaJson);

    return {
      ...values,
      schemaJsonText: formatJson(schemaJson),
      requiredFieldsText: formatRequiredFieldsText(schemaRequired),
    };
  } catch {
    // La validación posterior reportará el error de JSON.
  }

  return values;
}

function getSubmitValidationMessage(
  values: NotificationPayloadSchemaFormValues,
  isEditing: boolean,
): string | null {
  const schema = isEditing
    ? updateNotificationPayloadSchemaFormSchema
    : createNotificationPayloadSchemaFormSchema;
  const parsed = schema.safeParse(values);

  if (parsed.success) {
    return null;
  }

  return (
    parsed.error.issues.map((issue) => issue.message).join(' · ') ||
    'Revisa el formulario'
  );
}

interface FormBodyProps {
  initialData?: NotificationPayloadSchema | null;
  channels: NotificationChannel[];
  defaultChannelId?: string;
  onSubmit: (values: NotificationPayloadSchemaFormValues) => void;
  isSubmitting?: boolean;
  onCancel: () => void;
}

function NotificationPayloadSchemaFormBody({
  initialData,
  channels,
  defaultChannelId,
  onSubmit,
  isSubmitting,
  onCancel,
}: FormBodyProps) {
  const isEditing = Boolean(initialData);
  const initialBuilder = getInitialBuilderState(initialData);

  const [builderState, setBuilderState] =
    useState<SchemaBuilderState>(initialBuilder);
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [builderError, setBuilderError] = useState<string | undefined>();

  const builderStateRef = useRef(builderState);
  const editorModeRef = useRef(editorMode);
  builderStateRef.current = builderState;
  editorModeRef.current = editorMode;

  const channelOptions = channels.map((channel) => ({
    label: `${channel.name} (${channel.code})`,
    value: channel.id,
  }));

  const form = useForm({
    defaultValues: getInitialFormValues(
      initialData,
      defaultChannelId,
      initialBuilder,
    ),
    onSubmit: async ({ value }) => {
      const lockedValues = initialData
        ? {
            ...value,
            notificationChannelId: initialData.notificationChannelId,
            name: initialData.name,
            version: initialData.version,
          }
        : value;

      const finalValues = resolveFormValuesForSubmit(
        lockedValues,
        editorModeRef.current,
        builderStateRef.current,
      );
      onSubmit(finalValues);
    },
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentValues: NotificationPayloadSchemaFormValues = {
      notificationChannelId: initialData
        ? initialData.notificationChannelId
        : form.getFieldValue('notificationChannelId'),
      name: initialData ? initialData.name : form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      version: initialData
        ? initialData.version
        : form.getFieldValue('version'),
      schemaJsonText: form.getFieldValue('schemaJsonText'),
      exampleJsonText: form.getFieldValue('exampleJsonText'),
      requiredFieldsText: form.getFieldValue('requiredFieldsText'),
      active: form.getFieldValue('active'),
    };

    const finalValues = resolveFormValuesForSubmit(
      currentValues,
      editorModeRef.current,
      builderStateRef.current,
    );

    // Mantener form + builder alineados con lo que se envía.
    form.setFieldValue('schemaJsonText', finalValues.schemaJsonText);
    form.setFieldValue('requiredFieldsText', finalValues.requiredFieldsText);

    if (editorModeRef.current === 'json') {
      try {
        const parsedBuilder = schemaJsonToBuilderState(
          parseJsonObject(finalValues.schemaJsonText, 'schemaJson'),
          parseRequiredFieldsText(finalValues.requiredFieldsText),
        );
        setBuilderState(parsedBuilder);
        builderStateRef.current = parsedBuilder;
      } catch {
        // Si el JSON es inválido, la validación lo reporta abajo.
      }
    }

    const validationMessage = getSubmitValidationMessage(
      finalValues,
      isEditing,
    );

    if (validationMessage) {
      setBuilderError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    setBuilderError(undefined);
    onSubmit(finalValues);
  };

  const applyBuilderState = (next: SchemaBuilderState) => {
    setBuilderState(next);
    builderStateRef.current = next;
    setBuilderError(undefined);

    const synced = syncFormTextsFromBuilderState(next);
    form.setFieldValue('schemaJsonText', synced.schemaJsonText);
    form.setFieldValue('requiredFieldsText', synced.requiredFieldsText);
  };

  const syncBuilderFromJsonText = (): boolean => {
    try {
      const schemaJson = parseJsonObject(
        form.getFieldValue('schemaJsonText'),
        'schemaJson',
      );
      const requiredFields = parseRequiredFieldsText(
        form.getFieldValue('requiredFieldsText'),
      );
      const parsed = schemaJsonToBuilderState(schemaJson, requiredFields);
      const schemaRequired = getRequiredFieldsFromSchema(schemaJson);

      setBuilderState(parsed);
      builderStateRef.current = parsed;
      setBuilderError(undefined);
      form.setFieldValue(
        'requiredFieldsText',
        formatRequiredFieldsText(
          schemaRequired.length > 0 ? schemaRequired : requiredFields,
        ),
      );
      return true;
    } catch (error) {
      setBuilderError(
        error instanceof Error ? error.message : 'El JSON Schema no es válido.',
      );
      return false;
    }
  };

  const handleEditorModeChange = (value: string | number | null) => {
    const nextMode = value === 'json' ? 'json' : 'visual';

    if (nextMode === editorModeRef.current) {
      return;
    }

    if (nextMode === 'visual') {
      if (!syncBuilderFromJsonText()) {
        toast.error(
          builderError ??
            'No se pudo leer el JSON. Corrígelo antes de volver a Interfaz.',
        );
        return;
      }
    } else {
      applyBuilderState(builderStateRef.current);
    }

    setEditorMode(nextMode);
    editorModeRef.current = nextMode;
    setBuilderError(undefined);
  };

  const generateExample = () => {
    const currentBuilder =
      editorModeRef.current === 'visual'
        ? builderStateRef.current
        : (() => {
            try {
              return schemaJsonToBuilderState(
                parseJsonObject(
                  form.getFieldValue('schemaJsonText'),
                  'schemaJson',
                ),
                parseRequiredFieldsText(
                  form.getFieldValue('requiredFieldsText'),
                ),
              );
            } catch {
              return builderStateRef.current;
            }
          })();

    form.setFieldValue(
      'exampleJsonText',
      formatJson(buildExampleFromBuilderState(currentBuilder)),
    );
  };

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={handleFormSubmit}
    >
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
          title="Campos del payload"
          description="Usa la interfaz o JSON. Al guardar siempre se envía schemaJson + requiredFields."
        >
          <div className="flex flex-col gap-3">
            <div className="inline-flex h-8 w-fit items-center rounded-lg bg-muted p-[3px]">
              <button
                type="button"
                className={`inline-flex h-[calc(100%-2px)] items-center rounded-md px-3 text-xs font-medium transition-colors ${
                  editorMode === 'visual'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                disabled={isSubmitting}
                onClick={() => handleEditorModeChange('visual')}
              >
                Interfaz
              </button>
              <button
                type="button"
                className={`inline-flex h-[calc(100%-2px)] items-center rounded-md px-3 text-xs font-medium transition-colors ${
                  editorMode === 'json'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                disabled={isSubmitting}
                onClick={() => handleEditorModeChange('json')}
              >
                JSON
              </button>
            </div>

            {editorMode === 'visual' ? (
              <SchemaFieldsBuilder
                value={builderState}
                onChange={applyBuilderState}
                disabled={isSubmitting}
                error={builderError}
              />
            ) : null}

            {/* Campos JSON siempre montados para no perder el valor al cambiar de pestaña. */}
            <div
              className={
                editorMode === 'json' ? 'space-y-3' : 'hidden'
              }
              aria-hidden={editorMode !== 'json'}
            >
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Edición directa del JSON Schema. Es el mismo formato que recibe
                la API al crear o actualizar.
              </p>

              <form.Field name="schemaJsonText">
                {(field) => (
                  <JsonFormField
                    field={field}
                    label="JSON Schema"
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
                      className="h-8 rounded-md border-border/60 font-mono text-xs"
                    />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Se sincroniza desde{' '}
                      <code className="text-[10px]">required</code> del JSON al
                      guardar.
                    </p>
                  </div>
                )}
              </form.Field>

              {builderError && editorMode === 'json' ? (
                <p className="text-[11px] text-destructive">{builderError}</p>
              ) : null}
            </div>
          </div>
        </FormSection>

        {!isEditing ? (
          <>
            <Separator className="bg-border/50" />
            <FormSection
              title="Activación"
              description="El schema activo es el que se usa al validar solicitudes de notificación."
            >
              <form.Field name="active">
                {(field) => (
                  <SwitchFormField
                    field={field}
                    label="Activar al guardar"
                    description="Si ya hay otro schema activo en el canal, se desactivará automáticamente."
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>
            </FormSection>
          </>
        ) : null}

        <Separator className="bg-border/50" />

        <FormSection
          title="Ejemplo de payload"
          description="Opcional. Se genera a partir de los campos obligatorios."
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
                label="Ejemplo"
                placeholder='{\n  "to": [],\n  "subject": "",\n  "message": ""\n}'
                disabled={isSubmitting}
                description="Objeto de ejemplo que cumple con los campos definidos."
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
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-1.5"
        >
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
    </form>
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
  const formInstanceKey = initialData?.id ?? `new-${defaultChannelId ?? 'all'}`;

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
            Define los campos por interfaz o JSON. Al crear o actualizar siempre
            se guarda como JSON Schema.
          </SheetDescription>
        </SheetHeader>

        {open ? (
          <NotificationPayloadSchemaFormBody
            key={formInstanceKey}
            initialData={initialData}
            channels={channels}
            defaultChannelId={defaultChannelId}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
