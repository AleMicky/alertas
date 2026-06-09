'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { SeverityLevelsTable } from '@/features/severity-levels/components/severity-levels-table';
import { SeverityLevelFormDialog } from '@/features/severity-levels/components/severity-level-form-dialog';

import { useSeverityLevelsQuery } from '@/features/severity-levels/hooks/use-severity-levels-query';
import { useSeverityLevelsMutations } from '@/features/severity-levels/hooks/use-severity-levels-mutations';

import { SeverityLevel } from '@/features/severity-levels/severity-level.types';
import { CreateSeverityLevelDto } from '@/features/severity-levels/severity-level.schema';
import { LoadingTable, PageHeader } from '@/shared/components';

export default function SeverityLevelsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SeverityLevel | null>(null);

  const { data: severityLevels, isLoading } = useSeverityLevelsQuery();

  const {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
  } = useSeverityLevelsMutations();

  const isSubmitting = isCreating || isUpdating;

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSubmit = (values: CreateSeverityLevelDto) => {
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
    <main className="p-6 space-y-4">
      <PageHeader
        title="Niveles de severidad"
        description="Catálogo de niveles para clasificar alertas."
        action={
          <Button onClick={handleCreate}>
            Nuevo
          </Button>
        }

      />

      {isLoading ? (
         <LoadingTable />
      ) : (
        <SeverityLevelsTable
          data={severityLevels}
          onEdit={(item) => {
            setSelected(item);
            setOpen(true);
          }}
          onDelete={(id) => remove(id)}
        />
      )}

      <SeverityLevelFormDialog
        open={open}
        onOpenChange={setOpen}
        initialData={selected}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </main>
  );
}