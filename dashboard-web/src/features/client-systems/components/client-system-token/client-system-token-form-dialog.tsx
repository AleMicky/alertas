'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { FieldGroup } from '@/components/ui/field';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  SwitchFormField,
  TanStackForm,
  TextFormField,
  TextareaFormField,
} from '@/shared/components/form';

import {
  CreateClientSystemTokenDto,
  createClientSystemTokenSchema,
  defaultCreateClientSystemToken,
} from '@/features/client-systems/schemas/client-system-token.schema';
import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ClientSystemToken | null;
  clientSystemId: string;
  isSubmitting: boolean;
  onSubmit: (values: CreateClientSystemTokenDto) => void;
}

export function ClientSystemTokenFormDialog({
  open,
  onOpenChange,
  initialData,
  clientSystemId,
  isSubmitting,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: defaultCreateClientSystemToken,
    validators: {
      onSubmit: createClientSystemTokenSchema,
    },
    onSubmit: async ({ value }) =>
      onSubmit({
        ...value,
        expiresAt: value.expiresAt || undefined,
      }),
  });

  useEffect(() => {
    form.reset({
      clientSystemId,
      description: initialData?.description ?? '',
      expiresAt: initialData?.expiresAt ?? '',
      active: initialData?.active ?? true,
    });
  }, [clientSystemId, form, initialData, open]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Editar token' : 'Nuevo token'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="description">
            {(field) => (
              <TextareaFormField
                field={field}
                label="Descripción"
                placeholder="Uso del token"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="expiresAt">
            {(field) => (
              <TextFormField
                field={field}
                label="Expira en"
                type="datetime-local"
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
