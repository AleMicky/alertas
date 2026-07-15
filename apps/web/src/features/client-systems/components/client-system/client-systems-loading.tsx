import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ClientSystemsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex overflow-hidden rounded-lg border border-muted/60 bg-card shadow-sm">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-1 items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5"
          >
            <Skeleton className="size-7 shrink-0 rounded-md sm:size-8" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-5">
        <Card className="overflow-hidden border-muted/60 shadow-sm xl:col-span-2">
          <CardHeader className="space-y-3 border-b bg-muted/20">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-9 w-full" />
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-muted/60 shadow-sm xl:col-span-3">
          <CardHeader className="space-y-2 border-b bg-muted/20">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
