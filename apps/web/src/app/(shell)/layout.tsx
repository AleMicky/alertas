import { AppShellLayout } from "@/components/layout"
import { AuthGuard } from "@/features/auth/components/auth-guard"

export default function ShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <AppShellLayout>{children}</AppShellLayout>
    </AuthGuard>
  )
}
