'use client';

import { useState } from 'react';

import { useClientSystemTokenMutations } from '@/features/client-systems/hooks/client-system-token/use-client-system-token-mutations';
import { useClientSystemTokensByClientSystem } from '@/features/client-systems/hooks/client-system-token/use-client-system-tokens-by-client-system';
import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';
import { ClientSystemTokenFormDialog } from './client-system-token-form-dialog';
import { ClientSystemTokenTable } from './client-system-token-table';

interface Props {
  clientSystemId: string;
}

export function ClientSystemTokenTabContent({ clientSystemId }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ClientSystemToken | null>(null);

  const { data: tokens = [], isLoading } = useClientSystemTokensByClientSystem(clientSystemId);
  const {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
  } = useClientSystemTokenMutations();

  return (
    <>
      <ClientSystemTokenTable
        data={tokens}
        isLoading={isLoading}
        onCreate={() => {
          setSelected(null);
          setDialogOpen(true);
        }}
        onEdit={(item) => {
          setSelected(item);
          setDialogOpen(true);
        }}
        onDelete={(id) => remove(id)}
      />

      <ClientSystemTokenFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected}
        clientSystemId={clientSystemId}
        isSubmitting={isCreating || isUpdating}
        onSubmit={(values) => {
          if (selected) {
            update(
              {
                id: selected.id,
                data: values,
              },
              {
                onSuccess: () => {
                  setSelected(null);
                  setDialogOpen(false);
                },
              },
            );
            return;
          }

          create(values, {
            onSuccess: () => {
              setSelected(null);
              setDialogOpen(false);
            },
          });
        }}
      />
    </>
  );
}
