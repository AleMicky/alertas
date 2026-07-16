'use client';

import { AtSign, Mail, Shield, User } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AuthUser } from '../auth.types';

type ProfileViewProps = {
  user: AuthUser;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function DetailRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof User;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border/60 hover:bg-muted/40',
        className,
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ProfileView({ user }: ProfileViewProps) {
  const initials = getInitials(user.fullName);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent"
        />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <Avatar className="size-20 rounded-2xl text-xl after:rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-primary/15 text-lg font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-1">
              <h2 className="truncate text-2xl font-semibold tracking-tight">
                {user.fullName}
              </h2>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 font-normal">
                <AtSign className="size-3" aria-hidden />
                {user.username}
              </Badge>
              {user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">Sin roles</Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Datos de la cuenta</CardTitle>
            <CardDescription>
              Información asociada a tu sesión activa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 pt-4">
            <DetailRow icon={User} label="Nombre completo" value={user.fullName} />
            <DetailRow icon={AtSign} label="Usuario" value={user.username} />
            <DetailRow icon={Mail} label="Correo electrónico" value={user.email} />
            <div className="flex items-start gap-3 rounded-xl p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="size-4" aria-hidden />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Roles asignados
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Sin roles asignados
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Seguridad</CardTitle>
            <CardDescription>
              La contraseña se gestiona en Keycloak (Account Console o
              administrador del realm).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Para cambiar tu contraseña, contacta al administrador o usa la
              consola de cuenta de Keycloak asociada a este entorno.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProfileViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-2xl border bg-card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="size-20 rounded-2xl bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 rounded-lg bg-muted" />
            <div className="h-4 w-64 rounded-md bg-muted" />
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-muted" />
              <div className="h-6 w-16 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="animate-pulse rounded-xl border bg-card p-6 lg:col-span-2">
          <div className="mb-6 h-5 w-40 rounded bg-muted" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 rounded-xl bg-muted/70" />
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-xl border bg-card p-6 lg:col-span-3">
          <div className="mb-6 h-5 w-32 rounded bg-muted" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-10 rounded-md bg-muted/70" />
            ))}
            <div className="mt-6 h-10 w-40 rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
