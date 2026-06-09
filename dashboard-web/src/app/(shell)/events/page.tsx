'use client';

import { EventsTable } from '@/features/events/components/events-table';
import { useEventQuery } from '@/features/events/hooks/use-event-query';
import { LoadingTable, PageHeader } from '@/shared/components';

export default function EventsPage() {
  const { data: events, isLoading } = useEventQuery();

  return (
    <main className="p-6 space-y-6">
      <PageHeader
        title="Seguimiento de eventos"
        description="Monitorea el ciclo de vida, estados y payloads de cada evento en tiempo operativo."
      />

      {isLoading ? (
        <LoadingTable />
      ) : (
        <EventsTable data={events} />
      )}
    </main>
  );
}
