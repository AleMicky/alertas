'use client';

import { useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { Braces, Link2 } from 'lucide-react';

import { FieldGroup } from '@/components/ui/field';
import {
  FormSubmitButtons,
  TanStackForm,
  TextareaFormField,
  TextFormField,
} from '@/shared/components/form';

import { buildNotificationChannelFormValues } from '../notification-channel-payload.utils';
import {
  CreateNotificationChannelDto,
  CreateNotificationChannelFormValues,
  createNotificationChannelSchema,
} from '../notification-channel.schema';
import { NotificationChannel } from '../notification-channel.types';
import { NotificationChannelPayloadEditor } from './notification-channel-payload-editor';

interface Props {
  initialData?: NotificationChannel | null;
  onSubmit: (values: CreateNotificationChannelDto) => void;
  isSubmitting?: boolean;
}

interface FormProps extends Props {
  initialValues: CreateNotificationChannelFormValues;
}

function NotificationChannelFormFields({
  initialData,
  initialValues,
  onSubmit,
  isSubmitting,
}: FormProps) {
  const isEditing = Boolean(initialData);

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: createNotificationChannelSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(createNotificationChannelSchema.parse(value));
    },
  });

  return (
    <TanStackForm form={form} className="space-y-6">
      <FieldGroup>
        <form.Field name="code">
          {(field) => (
            <TextFormField
              field={field}
              label="Código"
              placeholder="TELEGRAM_OPS"
              autoComplete="off"
              disabled={isSubmitting || isEditing}
              className="font-mono"
            />
          )}
        </form.Field>

        <form.Field name="name">
          {(field) => (
            <TextFormField
              field={field}
              label="Nombre"
              placeholder="Telegram Operaciones"
              autoComplete="off"
              disabled={isSubmitting}
            />
          )}
        </form.Field>
      </FieldGroup>

      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <Link2 className="size-4 text-primary" aria-hidden />
          Endpoint webhook
        </div>

        <form.Field name="webhookUrl">
          {(field) => (
            <TextareaFormField
              field={field}
              label="URL del webhook"
              placeholder="https://n8n.ejemplo.com/webhook/telegram-ops"
              disabled={isSubmitting}
              rows={4}
              className="min-h-28 resize-y font-mono text-sm leading-relaxed break-all"
              description="Pega la URL completa del webhook. Se mostrará en varias líneas para facilitar la revisión."
            />
          )}
        </form.Field>
      </div>

      <form.Field name="description">
        {(field) => (
          <TextareaFormField
            field={field}
            label="Descripción"
            placeholder="Canal para el equipo de operaciones"
            disabled={isSubmitting}
            rows={3}
          />
        )}
      </form.Field>

      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <Braces className="size-4 text-primary" aria-hidden />
          Body del webhook
        </div>

        <form.Field name="payloadExampleText">
          {(payloadExampleField) => (
            <form.Field name="payloadRequired">
              {(payloadRequiredField) => (
                <NotificationChannelPayloadEditor
                  payloadExampleField={payloadExampleField}
                  payloadRequiredField={payloadRequiredField}
                  isSubmitting={isSubmitting}
                />
              )}
            </form.Field>
          )}
        </form.Field>
      </div>

      <FormSubmitButtons
        isSubmitting={isSubmitting}
        submitText={isEditing ? 'Actualizar canal' : 'Crear canal'}
        submittingText={isEditing ? 'Actualizando...' : 'Creando...'}
        onReset={() => form.reset(initialValues)}
      />
    </TanStackForm>
  );
}

export function NotificationChannelForm({
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const formKey = initialData?.id ?? 'new';
  const initialValues = useMemo(
    () => buildNotificationChannelFormValues(initialData),
  [
    initialData?.id,
    initialData?.updatedAt,
    initialData?.code,
    initialData?.name,
    initialData?.webhookUrl,
    initialData?.description,
    initialData?.payloadBodyJson,
    initialData?.payload_body_json,
    initialData?.payloadSchemaJson,
    initialData?.payload_schema_json,
  ],
  );

  return (
    <NotificationChannelFormFields
      key={formKey}
      initialData={initialData}
      initialValues={initialValues}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
