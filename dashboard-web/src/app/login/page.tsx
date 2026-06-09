"use client";

import { signIn } from "next-auth/react";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appBrand } from "@/navigation/app-nav-config";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl">{appBrand.name}</CardTitle>
          <CardDescription>
            Inicia sesión con Keycloak para acceder al panel de {appBrand.tagline.toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => signIn("keycloak", { callbackUrl: "/" })}
          >
            Iniciar sesión
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
