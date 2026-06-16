'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { FieldGroup } from '@/components/ui/field';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  TanStackForm,
  TextareaFormField,
  TextFormField,
} from '@/shared/components/form';

import {
  CreateClientSystemDto,
  createClientSystemSchema,
  defaultCreateClientSystem,
} from '../../schemas/client-system.schema';
import { ClientSystem } from '../../types/client-system.types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClientSystem | null;
  onSubmit: (values: CreateClientSystemDto) => void;
  isSubmitting?: boolean;
}

export function ClientSystemFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm({
    defaultValues: defaultCreateClientSystem,
    validators: {
      onSubmit: createClientSystemSchema,
    },

    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    form.reset({
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    });
  }, [initialData, open]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Editar sistema cliente' : 'Nuevo sistema cliente'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="code">
            {(field) => (
              <TextFormField
                field={field}
                label="Código"
                placeholder="ERP_CORE"
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
                placeholder="ERP Core"
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
