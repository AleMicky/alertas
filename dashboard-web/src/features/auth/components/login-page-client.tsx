"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { LoginForm } from "@/features/auth/components/login-form";
import { LoginPageSkeleton } from "@/features/auth/components/login-page-skeleton";
import { getSafeCallbackUrl } from "@/features/auth/login.utils";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading" || status === "authenticated") {
    return <LoginPageSkeleton />;
  }

  return <LoginForm callbackUrl={callbackUrl} />;
}
