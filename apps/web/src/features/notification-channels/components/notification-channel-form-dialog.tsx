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
  const isEditing = Boolean(initialData);

  const form = useForm({
    defaultValues: defaultCreateNotificationChannel,
    validators: {
      onSubmit: createNotificationChannelSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(createNotificationChannelSchema.parse(value));
    },
  });

  useEffect(() => {
    form.reset({
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
    });
  }, [initialData, open]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar canal' : 'Nuevo canal'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="code">
            {(field) => (
              <TextFormField
                field={field}
                label="Código"
                placeholder="TELEGRAM"
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
                placeholder="Telegram"
                autoComplete="off"
                disabled={isSubmitting}
              />
            )}
          </form.Field>
        </FieldGroup>

        <FormSubmitButtons
          isSubmitting={isSubmitting}
          submitText={isEditing ? 'Actualizar' : 'Guardar'}
          submittingText={isEditing ? 'Actualizando...' : 'Guardando...'}
          onReset={() => form.reset()}
        />
      </TanStackForm>
    </FormDialogLayout>
  );
}
