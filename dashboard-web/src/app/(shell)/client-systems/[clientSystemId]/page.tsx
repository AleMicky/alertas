'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState, LoadingTable } from '@/shared/components';

import { ClientSystemConfigurationHeader } from '@/features/client-systems/components/client-system/client-system-configuration-header';
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

  if (!clientSystem) {
    return (
      <main className="space-y-4 p-6">
        <EmptyState
          title="Sistema no encontrado"
          description="El sistema cliente solicitado no existe o fue eliminado."
        />
        <div className="flex justify-center">
          <Button nativeButton={false} render={<Link href="/client-systems" />}>
            Volver al listado
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <ClientSystemConfigurationHeader clientSystem={clientSystem} />

      <Tabs defaultValue="tokens">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="event-types">Tipos de evento</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="mt-4">
          <ClientSystemTokenTabContent
            clientSystemId={clientSystemId}
            clientSystem={clientSystem}
          />
        </TabsContent>

        <TabsContent value="event-types" className="mt-4">
          <EventTypeTabContent clientSystemId={clientSystemId} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
