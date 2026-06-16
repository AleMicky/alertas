'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/utils/format-date';

import { ClientSystemTokenTabContent } from '../client-system-token/client-system-token-tab-content';
import { EventTypeTabContent } from '../event-type/event-type-tab-content';
import { ClientSystem } from '../../types/client-system.types';

interface Props {
  clientSystem: ClientSystem | null;
}

function AuditField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

export function ClientSystemDetailPanel({ clientSystem }: Props) {
  if (!clientSystem) {
    return (
      <Card className="flex h-full min-h-[420px] items-center justify-center border-muted/60 shadow-sm">
        <EmptyState
          title="Selecciona un sistema"
          description="Elige un sistema de la lista lateral para ver y configurar sus tokens y tipos de evento."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-muted/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{clientSystem.name}</CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              {clientSystem.code}
            </Badge>
            <StatusBadge active={clientSystem.active} />
          </div>
          {clientSystem.description ? (
            <CardDescription>{clientSystem.description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AuditField
              label="Creado por"
              value={clientSystem.createdBy || '—'}
            />
            <AuditField
              label="Fecha de creación"
              value={formatDate(clientSystem.createdAt)}
            />
            <AuditField
              label="Actualizado por"
              value={clientSystem.updatedBy || '—'}
            />
            <AuditField
              label="Última actualización"
              value={formatDate(clientSystem.updatedAt)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tokens">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="event-types">Tipos de evento</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="mt-4">
          <ClientSystemTokenTabContent
            clientSystemId={clientSystem.id}
            clientSystem={clientSystem}
          />
        </TabsContent>

        <TabsContent value="event-types" className="mt-4">
          <EventTypeTabContent clientSystemId={clientSystem.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
