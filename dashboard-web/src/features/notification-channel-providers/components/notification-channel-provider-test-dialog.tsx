'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { FieldGroup } from '@/components/ui/field';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  TanStackForm,
  TextFormField,
} from '@/shared/components/form';

import { NotificationChannelProvider } from '../notification-channel-provider.types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: NotificationChannelProvider | null;
  isSubmitting?: boolean;
  onSubmit: (values: {
    target?: string;
    title?: string;
    message?: string;
  }) => void;
}

export function NotificationChannelProviderTestDialog({
  open,
  onOpenChange,
  provider,
  isSubmitting,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: {
      target: 'test-target',
      title: 'Prueba proveedor',
      message: 'Mensaje enviado desde el dashboard hacia el webhook del proveedor',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        target: 'test-target',
        title: `Prueba ${provider?.name ?? 'proveedor'}`,
        message:
          'Mensaje enviado desde el dashboard hacia el webhook del proveedor',
      });
    }
  }, [open, provider]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Probar webhook"
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="target">
            {(field) => (
              <TextFormField
                field={field}
                label="Destino de prueba"
                placeholder="test-target"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="title">
            {(field) => (
              <TextFormField
                field={field}
                label="Título"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="message">
            {(field) => (
              <TextFormField
                field={field}
                label="Mensaje"
                disabled={isSubmitting}
              />
            )}
          </form.Field>
        </FieldGroup>

        <FormSubmitButtons
          isSubmitting={isSubmitting}
          submitText="Enviar prueba"
          submittingText="Enviando..."
          onReset={() => form.reset()}
        />
      </TanStackForm>
    </FormDialogLayout>
  );
}
