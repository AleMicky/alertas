'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Plus } from 'lucide-react';

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
import { LoadingTable } from '@/shared/components';

import { NotificationChannelProviderFormDialog } from '@/features/notification-channel-providers/components/notification-channel-provider-form-dialog';
import { NotificationChannelProviderTable } from '@/features/notification-channel-providers/components/notification-channel-provider-table';
import { NotificationChannelProviderTestDialog } from '@/features/notification-channel-providers/components/notification-channel-provider-test-dialog';
import { useNotificationChannelProviderMutations } from '@/features/notification-channel-providers/hooks/use-notification-channel-provider-mutations';
import { useNotificationChannelProvidersQuery } from '@/features/notification-channel-providers/hooks/use-notification-channel-provider-query';
import {
  NotificationChannelProviderFormValues,
  toCreateNotificationChannelProviderDto,
  toUpdateNotificationChannelProviderDto,
} from '@/features/notification-channel-providers/notification-channel-provider.schema';
import { NotificationChannelProvider } from '@/features/notification-channel-providers/notification-channel-provider.types';

export default function NotificationChannelProvidersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialChannelId = searchParams.get('channelId') ?? undefined;

  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(
    initialChannelId,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [selected, setSelected] =
    useState<NotificationChannelProvider | null>(null);
  const [testingProvider, setTestingProvider] =
    useState<NotificationChannelProvider | null>(null);

  const { data: channels, isLoading: isLoadingChannels } =
    useNotificationChannelsQuery();
  const { data: providers, isLoading: isLoadingProviders } =
    useNotificationChannelProvidersQuery(selectedChannelId);
  const {
    create,
    update,
    remove,
    activate,
    deactivate,
    validate,
    test,
    isCreating,
    isUpdating,
    isActivating,
    isDeactivating,
    isTesting,
  } = useNotificationChannelProviderMutations();

  const channelOptions = useMemo(() => channels ?? [], [channels]);
  const providerList = useMemo(() => providers ?? [], [providers]);
  const isSubmitting = isCreating || isUpdating;
  const isLoading = isLoadingChannels || isLoadingProviders;

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
      query
        ? `/notification-channel-providers?${query}`
        : '/notification-channel-providers',
    );
  };

  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (provider: NotificationChannelProvider) => {
    setSelected(provider);
    setFormOpen(true);
  };

  const handleSubmit = (values: NotificationChannelProviderFormValues) => {
    if (selected) {
      update(
        {
          id: selected.id,
          data: toUpdateNotificationChannelProviderDto(values),
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

    create(toCreateNotificationChannelProviderDto(values), {
      onSuccess: () => {
        setFormOpen(false);
        setSelected(null);
      },
    });
  };

  const handleTest = (provider: NotificationChannelProvider) => {
    setTestingProvider(provider);
    setTestOpen(true);
  };

  return (
    <main className="space-y-3">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Proveedores de canal
          </h1>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            Configura webhooks, autenticación y el proveedor activo por canal.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          size="sm"
          className="shrink-0 gap-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Plus className="size-3.5" />
          Nuevo proveedor
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
          <SelectTrigger
            id="channel-filter"
            className="h-8 w-full rounded-md border-border/60 bg-background text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
          >
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
        <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm shadow-black/3 dark:shadow-black/20">
          <CardHeader className="border-b border-border/50 px-4 py-3">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="px-4 py-3">
            <LoadingTable />
          </CardContent>
        </Card>
      ) : (
        <NotificationChannelProviderTable
          data={providerList}
          channels={channelOptions}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={(id) => remove(id)}
          onActivate={(id) => activate(id)}
          onDeactivate={(id) => deactivate(id)}
          onValidate={(id) => validate(id)}
          onTest={handleTest}
          isActivating={isActivating}
          isDeactivating={isDeactivating}
        />
      )}

      <NotificationChannelProviderFormDialog
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

      <NotificationChannelProviderTestDialog
        open={testOpen}
        onOpenChange={(open) => {
          setTestOpen(open);
          if (!open) {
            setTestingProvider(null);
          }
        }}
        provider={testingProvider}
        isSubmitting={isTesting}
        onSubmit={(values) => {
          if (!testingProvider) {
            return;
          }

          test(
            { id: testingProvider.id, data: values },
            {
              onSuccess: () => {
                setTestOpen(false);
                setTestingProvider(null);
              },
            },
          );
        }}
      />
    </main>
  );
}
