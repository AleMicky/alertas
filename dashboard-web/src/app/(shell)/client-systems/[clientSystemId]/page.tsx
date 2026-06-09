'use client';

import { useParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingTable, PageHeader } from '@/shared/components';

import { ClientSystemTokenTabContent } from '@/features/client-systems/components/client-system-token/client-system-token-tab-content';
import { EventTypeTabContent } from '@/features/client-systems/components/event-type/event-type-tab-content';
import { useClientSystemsQuery } from '@/features/client-systems/hooks/client-system/use-client-system-query';

export default function ClientSystemConfigurationPage() {
  const params = useParams<{ clientSystemId: string }>();
  const clientSystemId = params.clientSystemId;

  const { data: clientSystems, isLoading } = useClientSystemsQuery();
  const clientSystem = clientSystems.find((item) => item.id === clientSystemId);

  if (isLoading) {
    return (
      <main className="p-6">
        <LoadingTable />
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <PageHeader
        title={`Configuración: ${clientSystem?.name ?? 'Sistema cliente'}`}
        description="Gestiona tipos de evento y tokens de integración."
      />

      <Tabs defaultValue="event-types">
        <TabsList>
          <TabsTrigger value="event-types">Tipos de evento</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="event-types">
          <EventTypeTabContent clientSystemId={clientSystemId} />
        </TabsContent>

        <TabsContent value="tokens">
          <ClientSystemTokenTabContent clientSystemId={clientSystemId} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
