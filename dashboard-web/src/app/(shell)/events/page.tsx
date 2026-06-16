'use client';

import { EventsTable } from '@/features/events/components/events-table';
import { useEventQuery } from '@/features/events/hooks/use-event-query';
import { LoadingTable, PageHeader } from '@/shared/components';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const { data: events, isLoading, isFetching } = useEventQuery();

  return (
    <main className="space-y-3 p-4 md:p-5">
      <PageHeader
        title="Log de eventos"
        description="Vista operativa en tiempo real. Clic en una línea para ver payload y alertas."
        action={
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-[10px] uppercase',
              isFetching && 'animate-pulse',
            )}
          >
            {isFetching ? 'sync' : 'live · 15s'}
          </Badge>
        }
      />

      {isLoading ? (
        <LoadingTable />
      ) : (
        <EventsTable data={events} isFetching={isFetching} />
      )}
    </main>
  );
}
