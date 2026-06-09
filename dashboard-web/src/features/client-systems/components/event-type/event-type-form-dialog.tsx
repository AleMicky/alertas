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
  TextFormField,
  TextareaFormField,
} from '@/shared/components/form';

import {
  CreateEventTypeDto,
  createEventTypeSchema,
  defaultCreateEventType,
} from '@/features/client-systems/schemas/event-type.shcema';
import { EventType } from '@/features/client-systems/types/event-type.types';
import { useSeverityLevelsQuery } from '@/features/severity-levels/hooks/use-severity-levels-query';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: EventType | null;
  clientSystemId: string;
  isSubmitting: boolean;
  onSubmit: (values: CreateEventTypeDto) => void;
}

export function EventTypeFormDialog({
  open,
  onOpenChange,
  initialData,
  clientSystemId,
  isSubmitting,
  onSubmit,
}: Props) {
  const { data: severityLevels } = useSeverityLevelsQuery();
  const severityOptions = severityLevels.map((level) => ({
    label: `${level.code} - ${level.name}`,
    value: level.id,
  }));

  const form = useForm({
    defaultValues: defaultCreateEventType,
    validators: {
      onSubmit: createEventTypeSchema,
    },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  useEffect(() => {
    form.reset({
      clientSystemId,
      severityLevelId: initialData?.severityLevel?.id ?? '',
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      active: initialData?.active ?? true,
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

          <form.Field name="severityLevelId">
            {(field) => (
              <SelectFormField
                field={field}
                label="Severidad"
                options={severityOptions}
                placeholder="Seleccionar severidad"
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
