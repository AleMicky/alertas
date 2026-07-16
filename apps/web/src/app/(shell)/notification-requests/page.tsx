'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Archive,
  Bell,
  BellOff,
  CheckCircle2,
  Eye,
  Filter,
  FlaskConical,
  Inbox,
  Layers,
  MoreHorizontal,
  RefreshCcw,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClientSystemsQuery } from '@/features/client-systems/hooks/client-system/use-client-system-query';
import { useNotificationChannelsQuery } from '@/features/notification-channels/hooks/use-notification-channel-query';
import { NotificationRequestDetailSheet } from '@/features/notification-requests/components/notification-request-detail-sheet';
import { NotificationRequestValidatePayloadDialog } from '@/features/notification-requests/components/notification-request-validate-payload-dialog';
import { useNotificationRequestDetailQuery } from '@/features/notification-requests/hooks/use-notification-request-detail-query';
import { useNotificationRequestMutations } from '@/features/notification-requests/hooks/use-notification-request-mutations';
import { useNotificationRequestSearchQuery } from '@/features/notification-requests/hooks/use-notification-request-search-query';
import { useNotificationRequestStatsQuery } from '@/features/notification-requests/hooks/use-notification-request-stats-query';
import {
  NOTIFICATION_PRIORITY_OPTIONS,
  NOTIFICATION_REQUEST_STATUS_OPTIONS,
} from '@/features/notification-requests/notification-request.schema';
import {
  NotificationRequest,
  NotificationRequestSearchFilters,
  NotificationRequestStats,
  NotificationRequestStatus,
} from '@/features/notification-requests/notification-request.types';
import {
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_REQUEST_STATUS_LABELS,
  canRetryFailedNotificationRequest,
} from '@/features/notification-requests/notification-request.utils';
import { cn } from '@/lib/utils';
import { LoadingTable } from '@/shared/components';
import { formatDate } from '@/shared/utils/format-date';

const DEFAULT_FILTERS: NotificationRequestSearchFilters = {
  page: 1,
  size: 20,
};

function getStatusBadgeClass(status: NotificationRequestStatus): string {
  switch (status) {
    case 'SENT':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400';
    case 'PROCESSING':
    case 'QUEUED':
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400';
    case 'FAILED':
    case 'CANCELED':
      return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400';
    case 'RECEIVED':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400';
    case 'PARTIAL':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400';
    default:
      return 'border-border/60 bg-muted/40 text-muted-foreground';
  }
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  tone?: 'default' | 'success' | 'info' | 'danger';
}

function MetricCard({ label, value, icon, tone = 'default' }: MetricCardProps) {
  const toneClasses = {
    default: 'text-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-blue-600 dark:text-blue-400',
    danger: 'text-red-600 dark:text-red-400',
  }[tone];

  const iconBgClasses = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
  }[tone];

  return (
    <Card className="border-border/60 bg-card py-0 shadow-sm transition-colors hover:border-border hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-3.5 py-2.5">
        <div className="min-w-0 space-y-0.5">
          <CardDescription className="text-[11px] font-medium uppercase tracking-wide">
            {label}
          </CardDescription>
          <CardTitle
            className={cn('text-xl font-semibold tabular-nums leading-none', toneClasses)}
          >
            {value}
          </CardTitle>
        </div>
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md',
            iconBgClasses,
          )}
        >
          {icon}
        </div>
      </CardHeader>
    </Card>
  );
}

function MetricsSection({
  stats,
  isLoading,
}: {
  stats?: NotificationRequestStats;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="border-border/60 bg-card py-0 shadow-sm"
          >
            <CardHeader className="px-3.5 py-2.5">
              <Skeleton className="mb-2 h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const sentCount =
    stats?.byStatus.find((row) => row.key === 'SENT')?.count ?? 0;
  const failedCount =
    stats?.byStatus.find((row) => row.key === 'FAILED')?.count ?? 0;
  const processingCount =
    (stats?.byStatus.find((row) => row.key === 'PROCESSING')?.count ?? 0) +
    (stats?.byStatus.find((row) => row.key === 'QUEUED')?.count ?? 0);

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      <MetricCard
        label="Total"
        value={stats?.total ?? 0}
        icon={<Bell className="size-3.5" />}
      />
      <MetricCard
        label="Enviadas"
        value={sentCount}
        tone="success"
        icon={<CheckCircle2 className="size-3.5" />}
      />
      <MetricCard
        label="En proceso"
        value={processingCount}
        tone="info"
        icon={<Layers className="size-3.5" />}
      />
      <MetricCard
        label="Fallidas"
        value={failedCount}
        tone="danger"
        icon={<XCircle className="size-3.5" />}
      />
    </div>
  );
}

interface FilterFieldProps {
  label: string;
  children: ReactNode;
}

function FilterField({ label, children }: FilterFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function NotificationRequestsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] =
    useState<NotificationRequestSearchFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveDate, setArchiveDate] = useState('');
  const [validateOpen, setValidateOpen] = useState(false);
  const [validateContext, setValidateContext] = useState<{
    channelCode?: string;
    payload?: Record<string, unknown>;
  }>({});

  useEffect(() => {
    const requestId = searchParams.get('requestId')?.trim();

    if (!requestId) {
      return;
    }

    setSelectedId(requestId);
    setDetailOpen(true);
  }, [searchParams]);

  const { data: channels } = useNotificationChannelsQuery();
  const { data: clientSystems } = useClientSystemsQuery();
  const { data: searchResult, isLoading } =
    useNotificationRequestSearchQuery(filters);
  const { data: stats, isLoading: isLoadingStats } =
    useNotificationRequestStatsQuery({
      clientSystemId: filters.clientSystemId,
      requestedFrom: filters.requestedFrom,
      requestedTo: filters.requestedTo,
    });
  const { data: detail, isLoading: isLoadingDetail } =
    useNotificationRequestDetailQuery(selectedId);

  const {
    cancel,
    requeue,
    retryFailed,
    recalculateStatus,
    archive,
    remove,
    isCanceling,
    isRequeuing,
    isRetryingFailed,
    isRecalculating,
    isArchiving,
    isDeleting,
  } = useNotificationRequestMutations();

  const channelOptions = useMemo(() => channels ?? [], [channels]);
  const systemOptions = useMemo(() => clientSystems ?? [], [clientSystems]);
  const items = searchResult?.items ?? [];
  const total = searchResult?.total ?? 0;
  const page = searchResult?.page ?? filters.page ?? 1;
  const size = searchResult?.size ?? filters.size ?? 20;
  const totalPages = Math.max(Math.ceil(total / size), 1);

  const channelById = useMemo(
    () => new Map(channelOptions.map((channel) => [channel.id, channel])),
    [channelOptions],
  );
  const systemById = useMemo(
    () => new Map(systemOptions.map((system) => [system.id, system])),
    [systemOptions],
  );

  const updateFilters = (patch: Partial<NotificationRequestSearchFilters>) => {
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
  };

  const handleView = (item: NotificationRequest) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  const handleArchive = () => {
    if (!archiveDate) {
      return;
    }

    archive(
      { olderThan: new Date(archiveDate).toISOString() },
      {
        onSuccess: () => {
          setArchiveOpen(false);
          setArchiveDate('');
        },
      },
    );
  };

  return (
    <main className="space-y-3">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Solicitudes de notificación
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Monitorea el estado de envíos, filtra por canal o sistema y ejecuta
            acciones operativas sobre solicitudes y deliveries.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-border/60 bg-card text-xs shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={() => {
              setValidateContext({});
              setValidateOpen(true);
            }}
          >
            <FlaskConical className="size-3.5" />
            Probar payload
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 shrink-0 gap-1.5 border-border/60 bg-card text-xs shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={() => setArchiveOpen(true)}
          >
            <Archive className="size-3.5" />
            Archivar antiguas
          </Button>
        </div>
      </header>

      <MetricsSection stats={stats} isLoading={isLoadingStats} />

      <section className="rounded-lg border border-border/60 bg-card p-3 shadow-sm">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="size-3.5 text-muted-foreground" />
            Filtros
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            <RotateCcw className="size-3" />
            Limpiar
          </Button>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="Estado">
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(value) =>
                updateFilters({
                  status:
                    !value || value === 'all'
                      ? undefined
                      : (value as NotificationRequestSearchFilters['status']),
                })
              }
            >
              <SelectTrigger className="h-8 border-border/60 bg-background text-xs focus-visible:ring-2 focus-visible:ring-ring/50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {NOTIFICATION_REQUEST_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {NOTIFICATION_REQUEST_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Canal">
            <Select
              value={filters.notificationChannelId ?? 'all'}
              onValueChange={(value) =>
                updateFilters({
                  notificationChannelId:
                    !value || value === 'all' ? undefined : value,
                  channelCode: undefined,
                })
              }
            >
              <SelectTrigger className="h-8 border-border/60 bg-background text-xs focus-visible:ring-2 focus-visible:ring-ring/50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {channelOptions.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name} ({channel.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Sistema cliente">
            <Select
              value={filters.clientSystemId ?? 'all'}
              onValueChange={(value) =>
                updateFilters({
                  clientSystemId: !value || value === 'all' ? undefined : value,
                })
              }
            >
              <SelectTrigger className="h-8 border-border/60 bg-background text-xs focus-visible:ring-2 focus-visible:ring-ring/50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {systemOptions.map((system) => (
                  <SelectItem key={system.id} value={system.id}>
                    {system.name} ({system.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Prioridad">
            <Select
              value={filters.priority ?? 'all'}
              onValueChange={(value) =>
                updateFilters({
                  priority:
                    !value || value === 'all'
                      ? undefined
                      : (value as NotificationRequestSearchFilters['priority']),
                })
              }
            >
              <SelectTrigger className="h-8 border-border/60 bg-background text-xs focus-visible:ring-2 focus-visible:ring-ring/50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {NOTIFICATION_PRIORITY_OPTIONS.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {NOTIFICATION_PRIORITY_LABELS[priority]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Referencia externa">
            <Input
              className="h-8 border-border/60 bg-background text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
              placeholder="Buscar referencia…"
              value={filters.externalReference ?? ''}
              onChange={(event) =>
                updateFilters({
                  externalReference: event.target.value || undefined,
                })
              }
            />
          </FilterField>

          <FilterField label="Correlation ID">
            <Input
              className="h-8 border-border/60 bg-background font-mono text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
              placeholder="uuid o identificador"
              value={filters.correlationId ?? ''}
              onChange={(event) =>
                updateFilters({
                  correlationId: event.target.value || undefined,
                })
              }
            />
          </FilterField>

          <FilterField label="Idempotency key">
            <Input
              className="h-8 border-border/60 bg-background font-mono text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
              placeholder="clave única"
              value={filters.idempotencyKey ?? ''}
              onChange={(event) =>
                updateFilters({
                  idempotencyKey: event.target.value || undefined,
                })
              }
            />
          </FilterField>

          <FilterField label="Fecha desde">
            <Input
              className="h-8 border-border/60 bg-background text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
              type="datetime-local"
              value={filters.requestedFrom?.slice(0, 16) ?? ''}
              onChange={(event) =>
                updateFilters({
                  requestedFrom: event.target.value
                    ? new Date(event.target.value).toISOString()
                    : undefined,
                })
              }
            />
          </FilterField>

          <FilterField label="Fecha hasta">
            <Input
              className="h-8 border-border/60 bg-background text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
              type="datetime-local"
              value={filters.requestedTo?.slice(0, 16) ?? ''}
              onChange={(event) =>
                updateFilters({
                  requestedTo: event.target.value
                    ? new Date(event.target.value).toISOString()
                    : undefined,
                })
              }
            />
          </FilterField>
        </div>
      </section>

      <Card className="overflow-hidden border-border/60 bg-card py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/50 px-3.5 py-2.5">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-semibold">Solicitudes</CardTitle>
            <CardDescription className="text-[11px] tabular-nums">
              {total} resultado{total === 1 ? '' : 's'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-3.5 py-3">
              <LoadingTable />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                <Inbox className="size-4" />
              </div>
              <h3 className="text-sm font-medium text-foreground">
                Sin solicitudes
              </h3>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                No hay solicitudes que coincidan con los filtros actuales.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 h-8 gap-1.5 text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                <BellOff className="size-3.5" />
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50 bg-muted/20 hover:bg-muted/20">
                      <TableHead className="h-8 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Fecha
                      </TableHead>
                      <TableHead className="h-8 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Sistema
                      </TableHead>
                      <TableHead className="h-8 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Canal
                      </TableHead>
                      <TableHead className="h-8 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Estado
                      </TableHead>
                      <TableHead className="h-8 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Referencia
                      </TableHead>
                      <TableHead className="h-8 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Correlation ID
                      </TableHead>
                      <TableHead className="h-8 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Intentos
                      </TableHead>
                      <TableHead className="h-8 px-3 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const channel = item.notificationChannelId
                        ? channelById.get(item.notificationChannelId)
                        : null;
                      const channelCode =
                        channel?.code ??
                        (typeof item.payload.channel === 'string'
                          ? item.payload.channel
                          : '—');
                      const system = systemById.get(item.clientSystemId);
                      const canRetry = canRetryFailedNotificationRequest(
                        item.status,
                      );

                      return (
                        <TableRow
                          key={item.id}
                          className="border-b border-border/40 transition-colors hover:bg-muted/30"
                        >
                          <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                            {formatDate(item.requestedAt)}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs">
                            {system ? (
                              <span className="font-medium">{system.code}</span>
                            ) : (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {item.clientSystemId.slice(0, 8)}…
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="px-3 py-2 font-mono text-[11px]">
                            {channelCode}
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                'h-5 border px-1.5 text-[10px] font-medium',
                                getStatusBadgeClass(item.status),
                              )}
                            >
                              {NOTIFICATION_REQUEST_STATUS_LABELS[item.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[120px] truncate px-3 py-2 font-mono text-[11px] text-muted-foreground">
                            {item.externalReference ?? '—'}
                          </TableCell>
                          <TableCell className="max-w-[120px] truncate px-3 py-2 font-mono text-[11px] text-muted-foreground">
                            {item.correlationId ?? '—'}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-center text-xs tabular-nums text-muted-foreground">
                            —
                          </TableCell>
                          <TableCell className="px-3 py-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-7 p-0 focus-visible:ring-2 focus-visible:ring-ring/50"
                                    aria-label="Abrir acciones"
                                  >
                                    <MoreHorizontal className="size-3.5" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  className="gap-2 text-xs"
                                  onClick={() => handleView(item)}
                                >
                                  <Eye className="size-3.5" />
                                  Ver detalle
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2 text-xs"
                                  disabled={!canRetry || isRetryingFailed}
                                  onClick={() => retryFailed(item.id)}
                                >
                                  <RefreshCcw className="size-3.5" />
                                  Reintentar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2 text-xs"
                                  onClick={() => handleView(item)}
                                >
                                  <Send className="size-3.5" />
                                  Ver deliveries
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-xs"
                                  onClick={() => setArchiveOpen(true)}
                                >
                                  <Archive className="size-3.5" />
                                  Archivar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-2 border-t border-border/50 px-3.5 py-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-muted-foreground">
                  Página {page} de {totalPages}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
                    onClick={() =>
                      setFilters((current) => ({ ...current, page: page - 1 }))
                    }
                    disabled={page <= 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-xs focus-visible:ring-2 focus-visible:ring-ring/50"
                    onClick={() =>
                      setFilters((current) => ({ ...current, page: page + 1 }))
                    }
                    disabled={page >= totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <NotificationRequestDetailSheet
        detail={detail}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setSelectedId(undefined);
          }
        }}
        channels={channelOptions}
        clientSystems={systemOptions}
        isLoading={isLoadingDetail}
        onCancel={(id) => cancel(id)}
        onRequeue={(id) => requeue(id)}
        onRetryFailed={(id) => retryFailed(id)}
        onRecalculateStatus={(id) => recalculateStatus(id)}
        onValidatePayload={(channelCode, payload) => {
          setValidateContext({ channelCode, payload });
          setValidateOpen(true);
        }}
        onDelete={(id) =>
          remove(id, {
            onSuccess: () => {
              setDetailOpen(false);
              setSelectedId(undefined);
            },
          })
        }
        isCanceling={isCanceling}
        isRequeuing={isRequeuing}
        isRetryingFailed={isRetryingFailed}
        isRecalculating={isRecalculating}
        isDeleting={isDeleting}
      />

      <NotificationRequestValidatePayloadDialog
        open={validateOpen}
        onOpenChange={(open) => {
          setValidateOpen(open);
          if (!open) {
            setValidateContext({});
          }
        }}
        channels={channelOptions}
        initialChannelCode={validateContext.channelCode}
        initialPayload={validateContext.payload}
      />

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="border-border/60 shadow-lg">
          <DialogHeader>
            <DialogTitle>Archivar solicitudes antiguas</DialogTitle>
            <DialogDescription>
              Se archivarán solicitudes completadas anteriores a la fecha
              indicada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="archive-date">Anteriores a</Label>
            <Input
              id="archive-date"
              type="datetime-local"
              className="focus-visible:ring-2 focus-visible:ring-ring/50"
              value={archiveDate}
              onChange={(event) => setArchiveDate(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={() => setArchiveOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleArchive}
              disabled={!archiveDate || isArchiving}
              className="focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Archivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
