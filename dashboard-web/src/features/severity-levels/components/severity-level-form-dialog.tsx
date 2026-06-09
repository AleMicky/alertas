'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { FieldGroup } from '@/components/ui/field';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  NumberFormField,
  SwitchFormField,
  TanStackForm,
  TextareaFormField,
  TextFormField,
} from '@/shared/components/form';

import { SeverityLevel } from '../severity-level.types';
import {
  CreateSeverityLevelDto,
  createSeverityLevelSchema,
  defaultCreateSeverityLevel,
} from '../severity-level.schema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SeverityLevel | null;
  onSubmit: (values: CreateSeverityLevelDto) => void;
  isSubmitting?: boolean;
}

export function SeverityLevelFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm({
    defaultValues: defaultCreateSeverityLevel,
    validators: {
      onSubmit: createSeverityLevelSchema,
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
      priority: initialData?.priority ?? 1,
      attentionTimeMinutes: initialData?.attentionTimeMinutes ?? 60,
      active: initialData?.active ?? true,
    });
  }, [initialData, open]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Editar severidad' : 'Nueva severidad'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="code">
            {(field) => (
              <TextFormField
                field={field}
                label="Código"
                placeholder="HIGH"
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
                placeholder="Alto"
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

          <form.Field name="priority">
            {(field) => (
              <NumberFormField
                field={field}
                label="Prioridad"
                min={1}
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="attentionTimeMinutes">
            {(field) => (
              <NumberFormField
                field={field}
                label="Tiempo de atención minutos"
                min={1}
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