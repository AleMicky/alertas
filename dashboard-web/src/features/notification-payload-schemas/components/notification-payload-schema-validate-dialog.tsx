'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { FieldGroup } from '@/components/ui/field';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  JsonFormField,
  TanStackForm,
} from '@/shared/components/form';

import { NotificationPayloadSchema } from '../notification-payload-schema.types';
import { formatJson } from '../notification-payload-schema.utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schema: NotificationPayloadSchema | null;
  isSubmitting?: boolean;
  onSubmit: (payload: Record<string, unknown>) => void;
}

export function NotificationPayloadSchemaValidateDialog({
  open,
  onOpenChange,
  schema,
  isSubmitting,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: {
      payloadJsonText: '',
    },
    onSubmit: async ({ value }) => {
      const parsed = JSON.parse(value.payloadJsonText) as unknown;

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('El payload debe ser un objeto JSON');
      }

      onSubmit(parsed as Record<string, unknown>);
    },
  });

  useEffect(() => {
    if (open && schema) {
      form.reset({
        payloadJsonText: schema.example
          ? formatJson(schema.example)
          : '{\n  \n}',
      });
    }
  }, [open, schema]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Validar payload"
    >
      {schema ? (
        <p className="mb-3 text-xs text-muted-foreground">
          Prueba un payload contra el schema v{schema.version} ({schema.name}).
        </p>
      ) : null}
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="payloadJsonText">
            {(field) => (
              <JsonFormField
                field={field}
                label="Payload JSON"
                placeholder='{\n  "to": ["usuario@empresa.com"],\n  "subject": "Hola",\n  "message": "Mensaje"\n}'
                disabled={isSubmitting}
                className="min-h-[180px] font-mono text-xs"
              />
            )}
          </form.Field>
        </FieldGroup>

        <FormSubmitButtons
          isSubmitting={isSubmitting}
          submitText="Validar payload"
          submittingText="Validando..."
          onReset={() => form.reset()}
        />
      </TanStackForm>
    </FormDialogLayout>
  );
}
