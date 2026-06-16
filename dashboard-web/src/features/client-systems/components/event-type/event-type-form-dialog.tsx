'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { FieldGroup } from '@/components/ui/field';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  TanStackForm,
  TextFormField,
  TextareaFormField,
} from '@/shared/components/form';

import {
  CreateEventTypeDto,
  UpdateEventTypeDto,
  createEventTypeSchema,
  defaultCreateEventType,
} from '@/features/client-systems/schemas/event-type.shcema';
import { EventType } from '@/features/client-systems/types/event-type.types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: EventType | null;
  clientSystemId: string;
  isSubmitting: boolean;
  onSubmit: (values: CreateEventTypeDto | UpdateEventTypeDto) => void;
}

export function EventTypeFormDialog({
  open,
  onOpenChange,
  initialData,
  clientSystemId,
  isSubmitting,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: defaultCreateEventType,
    validators: {
      onSubmit: createEventTypeSchema,
    },
    onSubmit: async ({ value }) => {
      if (initialData) {
        const { clientSystemId: _clientSystemId, ...updateData } = value;
        onSubmit(updateData);
        return;
      }

      onSubmit(value);
    },
  });

  useEffect(() => {
    form.reset({
      clientSystemId,
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    });
  }, [clientSystemId, form, initialData, open]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Editar tipo de evento' : 'Nuevo tipo de evento'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="code">
            {(field) => (
              <TextFormField
                field={field}
                label="Código"
                placeholder="ORDER_CREATED"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="name">
            {(field) => (
              <TextFormField
                field={field}
                label="Nombre"
                placeholder="Orden creada"
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
