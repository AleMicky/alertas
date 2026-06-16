'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ClientSystemDetailPanel } from '@/features/client-systems/components/client-system/client-system-detail-panel';
import { ClientSystemFormDialog } from '@/features/client-systems/components/client-system/client-system-form-dialog';
import { ClientSystemsLoading } from '@/features/client-systems/components/client-system/client-systems-loading';
import { ClientSystemsMetrics } from '@/features/client-systems/components/client-system/client-systems-metrics';
import { ClientSystemsList } from '@/features/client-systems/components/client-system/client-system-list';
import { useClientSystemsMutations } from '@/features/client-systems/hooks/client-system/use-client-system-mutations';
import { useClientSystemsQuery } from '@/features/client-systems/hooks/client-system/use-client-system-query';
import { CreateClientSystemDto } from '@/features/client-systems/schemas/client-system.schema';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { PageHeader } from '@/shared/components';

export default function ClientSystemsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ClientSystem | null>(null);
  const [detailSystem, setDetailSystem] = useState<ClientSystem | null>(null);

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

  useEffect(() => {
    if (systems.length === 0) {
      setDetailSystem(null);
      return;
    }

    setDetailSystem((current) => {
      if (current && systems.some((item) => item.id === current.id)) {
        return systems.find((item) => item.id === current.id) ?? current;
      }

      return systems[0];
    });
  }, [systems]);

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

  const handleDelete = (id: string) => {
    remove(id, {
      onSuccess: () => {
        if (detailSystem?.id === id) {
          setDetailSystem(null);
        }
      },
    });
  };

  return (
    <main className="space-y-4">
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

          <div className="grid items-start gap-4 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <ClientSystemsList
                data={systems}
                selectedId={detailSystem?.id}
                onSelect={setDetailSystem}
                onEdit={(item) => {
                  setSelected(item);
                  setOpen(true);
                }}
                onDelete={handleDelete}
                onCreate={handleCreate}
              />
            </div>

            <div className="xl:col-span-3">
              <ClientSystemDetailPanel clientSystem={detailSystem} />
            </div>
          </div>
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
