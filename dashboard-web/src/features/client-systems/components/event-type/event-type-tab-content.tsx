'use client';

import { useState } from 'react';

import { useEventTypeMutations } from '@/features/client-systems/hooks/event-type/use-event-type-mutations';
import { useEventTypesByClientSystem } from '@/features/client-systems/hooks/event-type/use-event-types-by-client-system';
import { EventType } from '@/features/client-systems/types/event-type.types';
import { EventTypeFormDialog } from './event-type-form-dialog';
import { EventTypeTable } from './event-type-table';

interface Props {
  clientSystemId: string;
}

export function EventTypeTabContent({ clientSystemId }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<EventType | null>(null);

  const { data: eventTypes = [], isLoading } = useEventTypesByClientSystem(clientSystemId);
  const {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
  } = useEventTypeMutations();

  return (
    <>
      <EventTypeTable
        data={eventTypes}
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

      <EventTypeFormDialog
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
