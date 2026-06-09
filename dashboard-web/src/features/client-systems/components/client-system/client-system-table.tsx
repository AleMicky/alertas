'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table';
import { EmptyState } from '@/shared/components';

import { ClientSystem } from '../../types/client-system.types';
import { createClientSystemColumns } from './client-system-columns';

interface Props {
  data: ClientSystem[];
  onEdit: (item: ClientSystem) => void;
  onDelete: (id: string) => void;
  onManage: (item: ClientSystem) => void;
  onCreate?: () => void;
}

export function ClientSystemsTable({
  data,
  onEdit,
  onDelete,
  onManage,
  onCreate,
}: Props) {
  const columns = createClientSystemColumns({
    onEdit,
    onDelete,
    onManage,
  });

  const activeCount = data.filter((item) => item.active).length;

  return (
    <Card className="overflow-hidden border-muted/60 shadow-sm">
      <CardHeader className="border-b bg-linear-to-r from-muted/30 to-transparent">
        <CardTitle className="text-base">Listado de sistemas</CardTitle>
        <CardDescription>
          {data.length === 0
            ? 'Aún no hay sistemas conectados.'
            : `${data.length} registro${data.length === 1 ? '' : 's'} · ${activeCount} activo${activeCount === 1 ? '' : 's'}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {data.length === 0 ? (
          <div className="space-y-4">
            <EmptyState
              title="Sin sistemas cliente"
              description="Registra el primer sistema para conectar fuentes de eventos y configurar tokens."
            />
            {onCreate ? (
              <div className="flex justify-center">
                <Button onClick={onCreate} className="gap-2">
                  <Plus className="size-4" />
                  Crear primer sistema
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            searchColumn="name"
            searchPlaceholder="Buscar por nombre o código..."
          />
        )}
      </CardContent>
    </Card>
  );
}
