'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

import { Badge } from '@/components/ui/badge';
import { FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { FormDialogLayout } from '@/shared/components/form-dialog-layout';
import {
  FormSubmitButtons,
  TanStackForm,
  TextFormField,
} from '@/shared/components/form';
import { useRolesOptionsQuery } from '../hooks/use-roles-options-query';
import { normalizeUserRoles, type User } from '../user.types';
import { toast } from 'sonner';
import {
  defaultCreateUser,
  userFormSchema,
  type CreateUserDto,
} from '../user.schema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: User | null;
  onSubmit: (values: CreateUserDto) => void;
  isSubmitting?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const { data: roles = [], isLoading: rolesLoading } = useRolesOptionsQuery();

  const form = useForm({
    defaultValues: defaultCreateUser,
    validators: {
      onSubmit: userFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!initialData && (!value.password || value.password.length < 8)) {
        toast.error('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      onSubmit(value as CreateUserDto);
    },
  });

  useEffect(() => {
    form.reset({
      username: initialData?.username ?? '',
      email: initialData?.email ?? '',
      password: '',
      fullName: initialData?.fullName ?? '',
      roles: normalizeUserRoles(initialData?.roles),
    });
  }, [initialData, open, form]);

  return (
    <FormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Editar usuario' : 'Nuevo usuario'}
    >
      <TanStackForm form={form}>
        <FieldGroup>
          <form.Field name="username">
            {(field) => (
              <TextFormField
                field={field}
                label="Usuario"
                placeholder="admin.alertas"
                autoComplete="off"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="fullName">
            {(field) => (
              <TextFormField
                field={field}
                label="Nombre completo"
                placeholder="Administrador"
                autoComplete="off"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <TextFormField
                field={field}
                label="Email"
                type="email"
                placeholder="admin@local.com"
                autoComplete="off"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <TextFormField
                field={field}
                label={initialData ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="roles">
            {(field) => {
              const selectedRoles = field.state.value ?? [];
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              const toggleRole = (code: string) => {
                const next = selectedRoles.includes(code)
                  ? selectedRoles.filter((role) => role !== code)
                  : [...selectedRoles, code];
                field.handleChange(next);
              };

              return (
                <div className="space-y-2" data-invalid={isInvalid}>
                  <Label>Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {rolesLoading ? (
                      <span className="text-sm text-muted-foreground">
                        Cargando roles...
                      </span>
                    ) : (
                      roles.map((role) => {
                        const active = selectedRoles.includes(role.code);
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => toggleRole(role.code)}
                            disabled={isSubmitting}
                            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Badge variant={active ? 'default' : 'outline'}>
                              {role.name}
                            </Badge>
                          </button>
                        );
                      })
                    )}
                  </div>
                  {isInvalid ? (
                    <p className="text-sm text-destructive">
                      Selecciona al menos un rol
                    </p>
                  ) : null}
                </div>
              );
            }}
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
