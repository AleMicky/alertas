'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { FieldGroup } from '@/components/ui/field';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  SelectFormField,
  SwitchFormField,
  TanStackForm,
  TextareaFormField,
  TextFormField,
} from '@/shared/components/form';

import { notificationChannelTypeOptions } from '../notification-channel.constants';
import {
  CreateNotificationChannelDto,
  createNotificationChannelSchema,
  defaultCreateNotificationChannel,
} from '../notification-channel.schema';
import { NotificationChannel } from '../notification-channel.types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: NotificationChannel | null;
  onSubmit: (values: CreateNotificationChannelDto) => void;
  isSubmitting?: boolean;
}

export function NotificationChannelFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm({
    defaultValues: defaultCreateNotificationChannel,
    validators: {
      onSubmit: createNotificationChannelSchema,
    },

    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    form.reset({
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
      type: initialData?.type ?? defaultCreateNotificationChannel.type,
      webhookUrl: initialData?.webhookUrl ?? '',
      description: initialData?.description ?? '',
      active: initialData?.active ?? true,
    });
  }, [initialData, open]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Editar canal' : 'Nuevo canal'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="code">
            {(field) => (
              <TextFormField
                field={field}
                label="Código"
                placeholder="EMAIL_OPS"
                autoComplete="off"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="name">
            {(field) => (
              <TextFormField
                field={field}
                label="Nombre"
                placeholder="Email operaciones"
                autoComplete="off"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="type">
            {(field) => (
              <SelectFormField
                field={field}
                label="Tipo"
                options={notificationChannelTypeOptions}
                placeholder="Seleccionar tipo"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="webhookUrl">
            {(field) => (
              <TextFormField
                field={field}
                label="URL del webhook"
                placeholder="https://..."
                autoComplete="off"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <TextareaFormField
                field={field}
                label="Descripción"
                placeholder="Descripción opcional"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="active">
            {(field) => (
              <SwitchFormField
                field={field}
                label="Activo"
                disabled={isSubmitting}
              />
            )}
          </form.Field>
        </FieldGroup>

        <FormSubmitButtons
          isSubmitting={isSubmitting}
          submitText={initialData ? 'Actualizar' : 'Guardar'}
          submittingText={initialData ? 'Actualizando...' : 'Guardando...'}
          onReset={() => form.reset()}
        />
      </TanStackForm>
    </FormDialogLayout>
  );
}
