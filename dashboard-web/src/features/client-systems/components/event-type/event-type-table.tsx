'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingTable } from '@/shared/components';
import { DataTable } from '@/shared/components/data-table';

import { EventType } from '@/features/client-systems/types/event-type.types';
import { createEventTypeColumns } from './event-type-columns';

interface Props {
  data: EventType[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (item: EventType) => void;
  onDelete: (id: string) => void;
}

export function EventTypeTable({
  data,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const columns = createEventTypeColumns({
    onEdit,
    onDelete,
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Tipos de evento</CardTitle>
        <Button onClick={onCreate}>
          Nuevo
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingTable />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            searchColumn="name"
            searchPlaceholder="Buscar tipo de evento..."
          />
        )}
      </CardContent>
    </Card>
  );
}
