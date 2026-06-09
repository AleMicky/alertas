'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingTable } from '@/shared/components';
import { DataTable } from '@/shared/components/data-table';

import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';
import { createClientSystemTokenColumns } from './client-system-token-columns';

interface Props {
  data: ClientSystemToken[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (item: ClientSystemToken) => void;
  onDelete: (id: string) => void;
}

export function ClientSystemTokenTable({
  data,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const columns = createClientSystemTokenColumns({
    onEdit,
    onDelete,
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Tokens del sistema</CardTitle>
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
            searchColumn="description"
            searchPlaceholder="Buscar token..."
          />
        )}
      </CardContent>
    </Card>
  );
}
