'use client';

import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/shared/components';

import { ClientSystem } from '../../types/client-system.types';
import { ClientSystemCard } from './client-system-card';

interface Props {
  data: ClientSystem[];
  selectedId?: string | null;
  onSelect: (item: ClientSystem) => void;
  onEdit: (item: ClientSystem) => void;
  onDelete: (id: string) => void;
  onCreate?: () => void;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function ClientSystemsList({
  data,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: Props) {
  const [search, setSearch] = useState('');

  const activeCount = data.filter((item) => item.active).length;

  const filtered = useMemo(() => {
    const query = normalize(search);
    if (!query) return data;

    return data.filter((item) => {
      const haystack = [
        item.name,
        item.code,
        item.description ?? '',
        item.createdBy ?? '',
        item.updatedBy ?? '',
      ]
        .map(normalize)
        .join(' ');

      return haystack.includes(query);
    });
  }, [data, search]);

  return (
    <Card className="flex h-full flex-col overflow-hidden border-muted/60 shadow-sm">
      <CardHeader className="shrink-0 border-b bg-linear-to-r from-muted/30 to-transparent">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Sistemas cliente</CardTitle>
            <CardDescription>
              {data.length === 0
                ? 'Aún no hay sistemas conectados.'
                : `${data.length} registro${data.length === 1 ? '' : 's'} · ${activeCount} activo${activeCount === 1 ? '' : 's'}`}
            </CardDescription>
          </div>
          {onCreate && data.length > 0 ? (
            <Button size="sm" onClick={onCreate} className="shrink-0 gap-1.5">
              <Plus className="size-4" />
              Nuevo
            </Button>
          ) : null}
        </div>

        {data.length > 0 ? (
          <div className="relative pt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, código o descripción..."
              className="pl-9"
            />
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-4">
        {data.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-8">
            <EmptyState
              title="Sin sistemas cliente"
              description="Registra el primer sistema para conectar fuentes de eventos y configurar tokens."
            />
            {onCreate ? (
              <Button onClick={onCreate} className="gap-2">
                <Plus className="size-4" />
                Crear primer sistema
              </Button>
            ) : null}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <EmptyState
              title="Sin resultados"
              description={`No hay sistemas que coincidan con "${search}".`}
            />
          </div>
        ) : (
          <div className="max-h-[min(70vh,720px)] space-y-2 overflow-y-auto pr-1">
            {filtered.map((system) => (
              <ClientSystemCard
                key={system.id}
                system={system}
                isSelected={system.id === selectedId}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
