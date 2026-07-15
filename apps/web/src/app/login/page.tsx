import { Suspense } from 'react';
import { Bell } from 'lucide-react';

import { LoginForm } from '@/features/auth/components/login-form';

function LoginFormFallback() {
  return (
    <div className="flex h-48 w-full max-w-sm items-center justify-center rounded-xl border border-border/60 bg-card/80 text-sm text-muted-foreground">
      Cargando formulario...
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/6 via-background to-primary/4" />
        <div className="absolute top-1/4 -left-20 size-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 size-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <header className="relative flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Bell className="size-5" aria-hidden />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight">MS Alertas</h1>
          <p className="text-sm text-muted-foreground">Notificación</p>
        </div>
      </header>

      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
