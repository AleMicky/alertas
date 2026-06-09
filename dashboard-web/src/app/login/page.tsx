import type { Metadata } from "next";
import { Suspense } from "react";

 import { LoginPageSkeleton } from "@/features/auth/components/login-page-skeleton";
 import { LoginPageClient } from "@/features/auth/components/login-page-client";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede al panel de gestión de alertas.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginPageClient />
    </Suspense>
  );
}
