import { Skeleton } from "@/components/ui/skeleton";

export function LoginPageSkeleton() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/40 p-4 sm:p-6">
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-xl">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="hidden flex-col justify-between gap-8 bg-primary/90 p-8 lg:flex">
            <Skeleton className="size-12 rounded-xl bg-primary-foreground/20" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48 bg-primary-foreground/20" />
              <Skeleton className="h-4 w-56 bg-primary-foreground/15" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-primary-foreground/15" />
              <Skeleton className="h-4 w-4/5 bg-primary-foreground/15" />
              <Skeleton className="h-4 w-3/5 bg-primary-foreground/15" />
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2 lg:hidden">
              <Skeleton className="size-11 rounded-xl" />
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>

            <div className="hidden space-y-2 lg:block">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
