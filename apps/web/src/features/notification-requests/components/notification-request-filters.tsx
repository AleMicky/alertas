'use client';

import { Filter, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';

import {
  NOTIFICATION_PRIORITY_OPTIONS,
  NOTIFICATION_REQUEST_STATUS_OPTIONS,
} from '../notification-request.schema';
import { NotificationRequestSearchFilters } from '../notification-request.types';
import {
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_REQUEST_STATUS_LABELS,
} from '../notification-request.utils';

interface Props {
  filters: NotificationRequestSearchFilters;
  channels: NotificationChannel[];
  clientSystems: ClientSystem[];
  onChange: (filters: NotificationRequestSearchFilters) => void;
  onReset: () => void;
}

export function NotificationRequestFilters({
  filters,
  channels,
  clientSystems,
  onChange,
  onReset,
}: Props) {
  const update = (patch: Partial<NotificationRequestSearchFilters>) => {
    onChange({ ...filters, ...patch, page: 1 });
  };

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="size-4 text-muted-foreground" />
          Filtros
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={onReset}
        >
          <RotateCcw className="size-3" />
          Limpiar
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(value) =>
            update({
              status:
                !value || value === 'all'
                  ? undefined
                  : (value as NotificationRequestSearchFilters['status']),
            })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {NOTIFICATION_REQUEST_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {NOTIFICATION_REQUEST_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority ?? 'all'}
          onValueChange={(value) =>
            update({
              priority:
                !value || value === 'all'
                  ? undefined
                  : (value as NotificationRequestSearchFilters['priority']),
            })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las prioridades</SelectItem>
            {NOTIFICATION_PRIORITY_OPTIONS.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {NOTIFICATION_PRIORITY_LABELS[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.notificationChannelId ?? 'all'}
          onValueChange={(value) =>
            update({
              notificationChannelId:
                !value || value === 'all' ? undefined : value,
              channelCode: undefined,
            })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name} ({channel.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.clientSystemId ?? 'all'}
          onValueChange={(value) =>
            update({
              clientSystemId: !value || value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Sistema cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sistemas</SelectItem>
            {clientSystems.map((system) => (
              <SelectItem key={system.id} value={system.id}>
                {system.name} ({system.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          className="h-8"
          placeholder="Referencia externa"
          value={filters.externalReference ?? ''}
          onChange={(event) =>
            update({ externalReference: event.target.value || undefined })
          }
        />

        <Input
          className="h-8"
          placeholder="Correlation ID"
          value={filters.correlationId ?? ''}
          onChange={(event) =>
            update({ correlationId: event.target.value || undefined })
          }
        />

        <Input
          className="h-8"
          placeholder="Idempotency key"
          value={filters.idempotencyKey ?? ''}
          onChange={(event) =>
            update({ idempotencyKey: event.target.value || undefined })
          }
        />

        <Input
          className="h-8"
          type="datetime-local"
          value={filters.requestedFrom?.slice(0, 16) ?? ''}
          onChange={(event) =>
            update({
              requestedFrom: event.target.value
                ? new Date(event.target.value).toISOString()
                : undefined,
            })
          }
        />

        <Input
          className="h-8"
          type="datetime-local"
          value={filters.requestedTo?.slice(0, 16) ?? ''}
          onChange={(event) =>
            update({
              requestedTo: event.target.value
                ? new Date(event.target.value).toISOString()
                : undefined,
            })
          }
        />
      </div>
    </div>
  );
}
