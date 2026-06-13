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
import type { Role } from '../role.types';
import {
  createRoleSchema,
  defaultCreateRole,
  type CreateRoleDto,
} from '../role.schema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Role | null;
  onSubmit: (values: CreateRoleDto) => void;
  isSubmitting?: boolean;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm({
    defaultValues: defaultCreateRole,
    validators: {
      onSubmit: createRoleSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    form.reset({
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
    });
  }, [initialData, open, form]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Editar rol' : 'Nuevo rol'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="code">
            {(field) => (
              <TextFormField
                field={field}
                label="Código"
                placeholder="ADMIN"
                autoComplete="off"
                disabled={isSubmitting || Boolean(initialData)}
              />
            )}
          </form.Field>

          <form.Field name="name">
            {(field) => (
              <TextFormField
                field={field}
                label="Nombre"
                placeholder="Administrador"
                autoComplete="off"
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
