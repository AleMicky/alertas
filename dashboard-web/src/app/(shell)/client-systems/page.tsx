'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ClientSystemFormDialog } from '@/features/client-systems/components/client-system/client-system-form-dialog';
import { ClientSystemsLoading } from '@/features/client-systems/components/client-system/client-systems-loading';
import { ClientSystemsMetrics } from '@/features/client-systems/components/client-system/client-systems-metrics';
import { ClientSystemsTable } from '@/features/client-systems/components/client-system/client-system-table';
import { useClientSystemsMutations } from '@/features/client-systems/hooks/client-system/use-client-system-mutations';
import { useClientSystemsQuery } from '@/features/client-systems/hooks/client-system/use-client-system-query';
import { CreateClientSystemDto } from '@/features/client-systems/schemas/client-system.schema';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { PageHeader } from '@/shared/components';

export default function ClientSystemsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ClientSystem | null>(null);

  const { data: clientSystems, isLoading } = useClientSystemsQuery();

  const {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
  } = useClientSystemsMutations();

  const isSubmitting = isCreating || isUpdating;

  const systems = useMemo(() => clientSystems ?? [], [clientSystems]);

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSubmit = (values: CreateClientSystemDto) => {
    if (selected) {
      update(
        {
          id: selected.id,
          data: values,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelected(null);
          },
        },
      );

      return;
    }

    create(values, {
      onSuccess: () => {
        setOpen(false);
        setSelected(null);
      },
    });
  };

  return (
    <main className="space-y-6">
      <PageHeader
        title="Sistemas cliente"
        description="Orígenes conectados que emiten eventos hacia la plataforma de alertas."
        action={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="size-4" />
            Nuevo sistema
          </Button>
        }
      />

      {isLoading ? (
        <ClientSystemsLoading />
      ) : (
        <>
          <ClientSystemsMetrics data={systems} />

          <ClientSystemsTable
            data={systems}
            onManage={(item) => router.push(`/client-systems/${item.id}`)}
            onEdit={(item) => {
              setSelected(item);
              setOpen(true);
            }}
            onDelete={(id) => remove(id)}
            onCreate={handleCreate}
          />
        </>
      )}

      <ClientSystemFormDialog
        open={open}
        onOpenChange={setOpen}
        initialData={selected}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
