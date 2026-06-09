"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "@tanstack/react-form";
import {
  AlertCircle,
  Bell,
  Eye,
  EyeOff,
  Loader2,
  Radio,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { appBrand } from "@/navigation/app-nav-config";
import { FormFieldError } from "@/shared/components/form/form-field-error";
import { TanStackForm, TextFormField } from "@/shared/components/form";
import { cn } from "@/lib/utils";

import {
  defaultLoginValues,
  loginSchema,
} from "../login.schema";

type LoginFormProps = {
  callbackUrl?: string;
};

const highlights = [
  {
    icon: Bell,
    title: "Alertas en tiempo real",
    description: "Monitorea y responde a incidentes desde un solo panel.",
  },
  {
    icon: ShieldAlert,
    title: "Reglas configurables",
    description: "Define severidades, canales y flujos de notificación.",
  },
  {
    icon: Radio,
    title: "Eventos centralizados",
    description: "Integra sistemas cliente y unifica la trazabilidad.",
  },
] as const;

export function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const router = useRouter();
  const passwordInputId = useId();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: defaultLoginValues,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(null);
      setIsSubmitting(true);

      try {
        const result = await signIn("credentials", {
          username: value.username,
          password: value.password,
          redirect: false,
        });

        if (result?.error) {
          setAuthError("Usuario o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.");
          return;
        }

        if (result?.ok === false) {
          setAuthError("No se pudo iniciar sesión. Inténtalo de nuevo en unos momentos.");
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      } catch {
        setAuthError("Error de conexión. Comprueba que el API esté disponible.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/40 p-4 sm:p-6">
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-xl">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <section className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/85 p-8 text-primary-foreground lg:flex">
            <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-8 size-48 rounded-full bg-black/10 blur-2xl" />

            <div className="relative flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
              <Bell className="size-6" aria-hidden />
            </div>

            <div className="relative space-y-3">
              <p className="text-sm font-medium tracking-wide text-primary-foreground/80 uppercase">
                {appBrand.tagline}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {appBrand.name}
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/85">
                Accede al panel operativo para gestionar alertas, eventos y canales de notificación.
              </p>
            </div>

            <ul className="relative space-y-4">
              {highlights.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 ring-1 ring-primary-foreground/15">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs leading-relaxed text-primary-foreground/75">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col justify-center p-6 sm:p-8">
            <div className="mb-6 space-y-3 lg:hidden">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Bell className="size-5" aria-hidden />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Iniciar sesión
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ingresa tus credenciales para continuar.
                </p>
              </div>
            </div>

            <div className="mb-6 hidden lg:block">
              <h2 className="text-2xl font-semibold tracking-tight">
                Bienvenido
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ingresa tu usuario y contraseña para acceder al sistema.
              </p>
            </div>

            <TanStackForm form={form}>
              <FieldGroup className="gap-4">
                <form.Field name="username">
                  {(field) => (
                    <TextFormField
                      field={field}
                      label="Usuario"
                      placeholder="admin.alertas"
                      autoComplete="username"
                      autoFocus
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={passwordInputId}>
                          Contraseña
                        </FieldLabel>

                        <div className="relative">
                          <Input
                            id={passwordInputId}
                            name={field.name}
                            type={showPassword ? "text" : "password"}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            placeholder="••••••••"
                            autoComplete="current-password"
                            aria-invalid={isInvalid}
                            disabled={isSubmitting}
                            className="pr-10"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword((current) => !current)}
                            disabled={isSubmitting}
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" aria-hidden />
                            ) : (
                              <Eye className="size-4" aria-hidden />
                            )}
                          </Button>
                        </div>

                        {isInvalid ? (
                          <FormFieldError errors={field.state.meta.errors} />
                        ) : null}
                      </Field>
                    );
                  }}
                </form.Field>

                {authError ? (
                  <div
                    role="alert"
                    className={cn(
                      "flex items-start gap-2 rounded-lg border border-destructive/30",
                      "bg-destructive/5 px-3 py-2.5 text-sm text-destructive",
                    )}
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <p>{authError}</p>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="h-10 w-full text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Iniciando sesión…
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </FieldGroup>
            </TanStackForm>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Acceso restringido a usuarios autorizados.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
