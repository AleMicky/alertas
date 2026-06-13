'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TanStackForm } from '@/shared/components/form';
import { FormFieldError } from '@/shared/components/form/form-field-error';
import {
  changePasswordSchema,
  defaultChangePasswordValues,
  type ChangePasswordDto,
  type ChangePasswordFormValues,
} from '../auth.schema';
import { useChangePasswordMutation } from '../hooks/use-change-password-mutation';

type ChangePasswordFormProps = {
  embedded?: boolean;
};

export function ChangePasswordForm({ embedded = false }: ChangePasswordFormProps) {
  const { changePassword, isChangingPassword } = useChangePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: defaultChangePasswordValues,
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: ChangePasswordDto = {
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      };
      changePassword(payload);
    },
  });

  const renderPasswordField = (
    fieldName: keyof Pick<
      ChangePasswordFormValues,
      'currentPassword' | 'newPassword' | 'confirmPassword'
    >,
    label: string,
    autoComplete: string,
    showPassword: boolean,
    onToggleVisibility: () => void,
  ) => (
    <form.Field name={fieldName}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id={field.name}
                name={field.name}
                type={showPassword ? 'text' : 'password'}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                autoComplete={autoComplete}
                className="h-10 pr-10 pl-9"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={onToggleVisibility}
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </Button>
            </div>
            {isInvalid && <FormFieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    </form.Field>
  );

  const formContent = (
    <TanStackForm form={form}>
      <FieldGroup className={embedded ? 'gap-4' : 'gap-5'}>
        {renderPasswordField(
          'currentPassword',
          'Contraseña actual',
          'current-password',
          showCurrentPassword,
          () => setShowCurrentPassword((current) => !current),
        )}
        <Separator className={embedded ? 'my-1' : 'hidden'} />
        {renderPasswordField(
          'newPassword',
          'Nueva contraseña',
          'new-password',
          showNewPassword,
          () => setShowNewPassword((current) => !current),
        )}
        {renderPasswordField(
          'confirmPassword',
          'Confirmar nueva contraseña',
          'new-password',
          showConfirmPassword,
          () => setShowConfirmPassword((current) => !current),
        )}
      </FieldGroup>

      <div
        className={
          embedded
            ? 'mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between'
            : undefined
        }
      >
        {embedded ? (
          <p className="text-sm text-muted-foreground">
            Al guardar los cambios deberás iniciar sesión de nuevo.
          </p>
        ) : null}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              className={embedded ? 'sm:shrink-0' : 'mt-6'}
              disabled={isSubmitting || isChangingPassword}
            >
              {isSubmitting || isChangingPassword ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Actualizando...
                </>
              ) : (
                'Actualizar contraseña'
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </TanStackForm>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
        <CardDescription>
          Tras actualizar la contraseña deberás iniciar sesión de nuevo.
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
