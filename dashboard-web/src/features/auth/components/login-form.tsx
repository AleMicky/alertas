'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { TanStackForm } from '@/shared/components/form';
import { FormFieldError } from '@/shared/components/form/form-field-error';
import { useAuth } from '@/providers/auth-provider';
import {
  defaultLoginValues,
  loginSchema,
  type LoginDto,
} from '../auth.schema';

export function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get('from');

  const form = useForm({
    defaultValues: defaultLoginValues,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value as LoginDto, {
          redirectTo: redirectTo && redirectTo !== '/login' ? redirectTo : '/',
        });
      } catch {
        toast.error('Credenciales inválidas. Verifica tu usuario y contraseña.');
      }
    },
  });

  useEffect(() => {
    form.reset(defaultLoginValues);
  }, []);

  return (
    <Card className="w-full max-w-sm border-border/60 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur-sm">
      <CardContent className="pt-6">
        <TanStackForm form={form}>
          <FieldGroup className="gap-5">
            <form.Field name="username">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Usuario</FieldLabel>
                    <div className="relative">
                      <User
                        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="admin.alertas"
                        autoComplete="username"
                        className="h-10 pl-9"
                      />
                    </div>
                    {isInvalid && (
                      <FormFieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
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
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-10 pr-10 pl-9"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" aria-hidden />
                        ) : (
                          <Eye className="size-4" aria-hidden />
                        )}
                      </Button>
                    </div>
                    {isInvalid && (
                      <FormFieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                className="mt-6 h-10 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            )}
          </form.Subscribe>
        </TanStackForm>
      </CardContent>
    </Card>
  );
}
