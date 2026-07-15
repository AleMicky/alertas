'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotificationChannelsQuery } from '@/features/notification-channels/hooks/use-notification-channel-query';
import { NotificationPayloadSchemaFormDialog } from '@/features/notification-payload-schemas/components/notification-payload-schema-form-dialog';
import { NotificationPayloadSchemaTable } from '@/features/notification-payload-schemas/components/notification-payload-schema-table';
import { NotificationPayloadSchemaValidateDialog } from '@/features/notification-payload-schemas/components/notification-payload-schema-validate-dialog';
import { useNotificationPayloadSchemaMutations } from '@/features/notification-payload-schemas/hooks/use-notification-payload-schema-mutations';
import { useNotificationPayloadSchemasQuery } from '@/features/notification-payload-schemas/hooks/use-notification-payload-schema-query';
import {
  NotificationPayloadSchemaFormValues,
  toCreateNotificationPayloadSchemaDto,
  toUpdateNotificationPayloadSchemaDto,
} from '@/features/notification-payload-schemas/notification-payload-schema.schema';
import { NotificationPayloadSchema } from '@/features/notification-payload-schemas/notification-payload-schema.types';
import { LoadingTable } from '@/shared/components';

export default function PayloadSchemasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialChannelId = searchParams.get('channelId') ?? undefined;

  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(
    initialChannelId,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [validateOpen, setValidateOpen] = useState(false);
  const [selected, setSelected] = useState<NotificationPayloadSchema | null>(null);
  const [validatingSchema, setValidatingSchema] =
    useState<NotificationPayloadSchema | null>(null);

  const { data: channels, isLoading: isLoadingChannels } =
    useNotificationChannelsQuery();
  const { data: schemas, isLoading: isLoadingSchemas } =
    useNotificationPayloadSchemasQuery(selectedChannelId);
  const {
    create,
    update,
    remove,
    activate,
    deactivate,
    validatePayload,
    isCreating,
    isUpdating,
    isActivating,
    isDeactivating,
    isValidatingPayload,
  } = useNotificationPayloadSchemaMutations();

  const channelOptions = useMemo(() => channels ?? [], [channels]);
  const schemaList = useMemo(() => schemas ?? [], [schemas]);
  const isSubmitting = isCreating || isUpdating;
  const isLoading = isLoadingChannels || isLoadingSchemas;

  const selectedChannelLabel = useMemo(() => {
    if (!selectedChannelId) {
      return 'Todos los canales';
    }

    const channel = channelOptions.find(
      (item) => item.id === selectedChannelId,
    );

    return channel ? `${channel.name} (${channel.code})` : 'Canal seleccionado';
  }, [channelOptions, selectedChannelId]);

  const handleChannelFilterChange = (value: string | null) => {
    const nextValue = !value || value === 'all' ? undefined : value;
    setSelectedChannelId(nextValue);

    const params = new URLSearchParams(searchParams.toString());

    if (nextValue) {
      params.set('channelId', nextValue);
    } else {
      params.delete('channelId');
    }

    const query = params.toString();
    router.replace(
      query ? `/payload-schemas?${query}` : '/payload-schemas',
    );
  };

  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (schema: NotificationPayloadSchema) => {
    setSelected(schema);
    setFormOpen(true);
  };

  const handleSubmit = (values: NotificationPayloadSchemaFormValues) => {
    try {
      if (selected) {
        update(
          {
            id: selected.id,
            data: toUpdateNotificationPayloadSchemaDto(values),
          },
          {
            onSuccess: () => {
              setFormOpen(false);
              setSelected(null);
            },
          },
        );
        return;
      }

      create(toCreateNotificationPayloadSchemaDto(values), {
        onSuccess: () => {
          setFormOpen(false);
          setSelected(null);
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo preparar el schema para guardar',
      );
    }
  };

  const handleValidate = (schema: NotificationPayloadSchema) => {
    setValidatingSchema(schema);
    setValidateOpen(true);
  };

  return (
    <main className="space-y-3">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Schemas de payload
          </h1>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            Define los campos del payload de cada canal. Internamente se guarda
            como JSON Schema.
          </p>
        </div>

        <Button onClick={handleCreate} size="sm" className="shrink-0 gap-1.5">
          <Plus className="size-3.5" />
          Nuevo schema
        </Button>
      </header>

      <div className="flex flex-col gap-1.5 sm:max-w-xs">
        <label
          htmlFor="channel-filter"
          className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
        >
          Filtrar por canal
        </label>
        <Select
          value={selectedChannelId ?? 'all'}
          onValueChange={handleChannelFilterChange}
        >
          <SelectTrigger id="channel-filter" className="h-8 w-full">
            <div className="flex min-w-0 items-center gap-2">
              <Filter className="size-3 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Todos los canales">
                {selectedChannelLabel}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            {channelOptions.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}{' '}
                <span className="font-mono text-[10px] text-muted-foreground">
                  ({channel.code})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm">
          <CardHeader className="border-b border-border/50 px-4 py-3">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="px-4 py-3">
            <LoadingTable />
          </CardContent>
        </Card>
      ) : (
        <NotificationPayloadSchemaTable
          data={schemaList}
          channels={channelOptions}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={(id) => remove(id)}
          onActivate={(id) => activate(id)}
          onDeactivate={(id) => deactivate(id)}
          onValidate={handleValidate}
          isActivating={isActivating}
          isDeactivating={isDeactivating}
        />
      )}

      <NotificationPayloadSchemaFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelected(null);
          }
        }}
        initialData={selected}
        channels={channelOptions}
        defaultChannelId={selectedChannelId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <NotificationPayloadSchemaValidateDialog
        open={validateOpen}
        onOpenChange={(open) => {
          setValidateOpen(open);
          if (!open) {
            setValidatingSchema(null);
          }
        }}
        schema={validatingSchema}
        isSubmitting={isValidatingPayload}
        onSubmit={(payload) => {
          if (!validatingSchema) {
            return;
          }

          validatePayload(
            { id: validatingSchema.id, data: { payload } },
            {
              onSuccess: (result) => {
                if (result.valid) {
                  setValidateOpen(false);
                  setValidatingSchema(null);
                }
              },
            },
          );
        }}
      />
    </main>
  );
}
