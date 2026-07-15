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
  GenerateClientSystemTokenDto,
  defaultGenerateClientSystemToken,
  generateClientSystemTokenSchema,
} from '@/features/client-systems/schemas/client-system-token.schema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (values: GenerateClientSystemTokenDto) => void;
}

export function ClientSystemTokenFormDialog({
  open,
  onOpenChange,
  isSubmitting,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: defaultGenerateClientSystemToken,
    validators: {
      onSubmit: generateClientSystemTokenSchema,
    },
    onSubmit: async ({ value }) =>
      onSubmit({
        expiresAt: value.expiresAt || undefined,
      }),
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultGenerateClientSystemToken);
    }
  }, [form, open]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Generar token"
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="expiresAt">
            {(field) => (
              <TextFormField
                field={field}
                label="Expira en"
                type="date"
                disabled={isSubmitting}
              />
            )}
          </form.Field>
        </FieldGroup>

        <FormSubmitButtons
          isSubmitting={isSubmitting}
          submitText="Generar"
          submittingText="Generando..."
          onReset={() => form.reset()}
        />
      </TanStackForm>
    </FormDialogLayout>
  );
}
