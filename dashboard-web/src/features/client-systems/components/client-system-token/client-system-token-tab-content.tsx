'use client';

import { useState } from 'react';

import { useClientSystemTokenMutations } from '@/features/client-systems/hooks/client-system-token/use-client-system-token-mutations';
import { useClientSystemTokensByClientSystem } from '@/features/client-systems/hooks/client-system-token/use-client-system-tokens-by-client-system';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';

import { ClientSystemTokenCreatedDialog } from './client-system-token-created-dialog';
import { ClientSystemTokenDetailSheet } from './client-system-token-detail-sheet';
import { ClientSystemTokenFormDialog } from './client-system-token-form-dialog';
import { ClientSystemTokenTable } from './client-system-token-table';

interface Props {
  clientSystemId: string;
  clientSystem?: ClientSystem;
}

export function ClientSystemTokenTabContent({
  clientSystemId,
  clientSystem,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdDialogOpen, setCreatedDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<ClientSystemToken | null>(null);
  const [plainToken, setPlainToken] = useState<string | null>(null);

  const { data: tokens = [], isLoading } = useClientSystemTokensByClientSystem(clientSystemId);
  const {
    generate,
    update,
    remove,
    revoke,
    isGenerating,
    isUpdating,
    isRevoking,
  } = useClientSystemTokenMutations();

  const closeDialogs = () => {
    setSelected(null);
    setDialogOpen(false);
  };

  const handleEditFromDetail = (token: ClientSystemToken) => {
    setDetailOpen(false);
    setSelected(token);
    setDialogOpen(true);
  };

  const handleRevoke = (tokenId: string) => {
    revoke(tokenId, {
      onSuccess: () => {
        setDetailOpen(false);
        setSelected(null);
      },
    });
  };

  return (
    <>
      <ClientSystemTokenTable
        data={tokens}
        isLoading={isLoading}
        onCreate={() => {
          setSelected(null);
          setDialogOpen(true);
        }}
        onView={(item) => {
          setSelected(item);
          setDetailOpen(true);
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
        isSubmitting={isGenerating || isUpdating}
        onSubmit={(values) => {
          if (selected) {
            update(
              {
                id: selected.id,
                data: values,
              },
              {
                onSuccess: closeDialogs,
              },
            );
            return;
          }

          generate(
            {
              clientSystemId,
              data: {
                description: values.description,
                expiresAt: values.expiresAt,
              },
            },
            {
              onSuccess: (response) => {
                setPlainToken(response.token);
                setCreatedDialogOpen(true);
                closeDialogs();
              },
            },
          );
        }}
      />

      <ClientSystemTokenCreatedDialog
        open={createdDialogOpen}
        onOpenChange={setCreatedDialogOpen}
        token={plainToken}
      />

      <ClientSystemTokenDetailSheet
        token={selected}
        clientSystem={clientSystem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEditFromDetail}
        onRevoke={handleRevoke}
        isRevoking={isRevoking}
      />
    </>
  );
}
