'use client';

import { KeyRound, Plus } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState, LoadingTable } from '@/shared/components';
import { DataTable } from '@/shared/components/data-table';

import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';
import { createClientSystemTokenColumns } from './client-system-token-columns';

interface Props {
  data: ClientSystemToken[];
  isLoading: boolean;
  onCreate: () => void;
  onView: (item: ClientSystemToken) => void;
  onDelete: (id: string) => void;
}

export function ClientSystemTokenTable({
  data,
  isLoading,
  onCreate,
  onView,
  onDelete,
}: Props) {
  const columns = createClientSystemTokenColumns({
    onView,
    onDelete,
  });

  const activeCount = data.filter((item) => item.active).length;

  return (
    <Card className="overflow-hidden border-muted/60 shadow-sm">
      <CardHeader className="flex-row items-center justify-between border-b bg-linear-to-r from-muted/30 to-transparent">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="size-4" aria-hidden />
            Tokens de integración
          </CardTitle>
          <CardDescription>
            {data.length === 0
              ? 'Genera tokens para que este sistema envíe eventos vía API.'
              : `${data.length} token${data.length === 1 ? '' : 's'} · ${activeCount} activo${activeCount === 1 ? '' : 's'}`}
          </CardDescription>
        </div>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="size-4" aria-hidden />
          Generar token
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingTable />
        ) : data.length === 0 ? (
          <div className="space-y-4">
            <EmptyState
              title="Sin tokens"
              description="Genera el primer token. El valor completo solo se mostrará una vez."
            />
            <div className="flex justify-center">
              <Button onClick={onCreate} className="gap-2">
                <Plus className="size-4" aria-hidden />
                Generar primer token
              </Button>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            searchColumn="token"
            searchPlaceholder="Buscar por referencia..."
          />
        )}
      </CardContent>
    </Card>
  );
}
