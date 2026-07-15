'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  CircleOff,
  KeyRound,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Server,
  Trash2,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { ClientSystemFormDialog } from '@/features/client-systems/components/client-system/client-system-form-dialog';
import { createClientSystemTokenColumns } from '@/features/client-systems/components/client-system-token/client-system-token-columns';
import { ClientSystemTokenCreatedDialog } from '@/features/client-systems/components/client-system-token/client-system-token-created-dialog';
import { ClientSystemTokenDetailSheet } from '@/features/client-systems/components/client-system-token/client-system-token-detail-sheet';
import { ClientSystemTokenFormDialog } from '@/features/client-systems/components/client-system-token/client-system-token-form-dialog';
import { useClientSystemTokenMutations } from '@/features/client-systems/hooks/client-system-token/use-client-system-token-mutations';
import { useClientSystemTokensByClientSystem } from '@/features/client-systems/hooks/client-system-token/use-client-system-tokens-by-client-system';
import { useClientSystemsMutations } from '@/features/client-systems/hooks/client-system/use-client-system-mutations';
import { useClientSystemsQuery } from '@/features/client-systems/hooks/client-system/use-client-system-query';
import { CreateClientSystemDto } from '@/features/client-systems/schemas/client-system.schema';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { ClientSystemToken } from '@/features/client-systems/types/client-system-token.types';
import { EmptyState, LoadingTable, StatusBadge } from '@/shared/components';
import { DataTable } from '@/shared/components/data-table';
import { formatDate } from '@/shared/utils/format-date';

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function ClientSystemsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ClientSystem | null>(null);
  const [detailSystem, setDetailSystem] = useState<ClientSystem | null>(null);
  const [search, setSearch] = useState('');
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [createdDialogOpen, setCreatedDialogOpen] = useState(false);
  const [tokenDetailOpen, setTokenDetailOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ClientSystemToken | null>(null);
  const [plainToken, setPlainToken] = useState<string | null>(null);

  const { data: clientSystems, isLoading } = useClientSystemsQuery();

  const {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
  } = useClientSystemsMutations();

  const { data: tokens = [], isLoading: isLoadingTokens } =
    useClientSystemTokensByClientSystem(detailSystem?.id);

  const {
    generate,
    revoke,
    isGenerating,
    isRevoking,
  } = useClientSystemTokenMutations();

  const isSubmitting = isCreating || isUpdating;

  const systems = useMemo(() => clientSystems ?? [], [clientSystems]);

  const activeCount = systems.filter((item) => item.active).length;
  const inactiveCount = systems.length - activeCount;

  const filtered = useMemo(() => {
    const query = normalize(search);
    if (!query) return systems;

    return systems.filter((item) => {
      const haystack = [
        item.name,
        item.code,
        item.description ?? '',
        item.createdBy ?? '',
        item.updatedBy ?? '',
      ]
        .map(normalize)
        .join(' ');

      return haystack.includes(query);
    });
  }, [systems, search]);

  const tokenColumns = useMemo(
    () =>
      createClientSystemTokenColumns({
        onView: (item) => {
          setSelectedToken(item);
          setTokenDetailOpen(true);
        },
        onDelete: (id) => revoke(id),
      }),
    [revoke],
  );

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

  const handleRevoke = (tokenId: string) => {
    revoke(tokenId, {
      onSuccess: () => {
        setTokenDetailOpen(false);
        setSelectedToken(null);
      },
    });
  };

  return (
    <main className="space-y-3">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Sistemas cliente
          </h1>
          <p className="text-xs text-muted-foreground">
            Orígenes conectados que envían eventos hacia la plataforma de
            alertas.
          </p>
        </div>
        <Button onClick={handleCreate} size="sm" className="shrink-0 gap-1.5">
          <Plus className="size-3.5" />
          Nuevo sistema
        </Button>
      </header>

      {isLoading ? (
        <ClientSystemsPageSkeleton />
      ) : (
        <>
          <section
            className="grid grid-cols-3 divide-x overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm"
            aria-label="Resumen de sistemas cliente"
          >
            <MetricCompact
              icon={Server}
              label="Total"
              value={systems.length}
              iconClassName="text-primary"
              iconBg="bg-primary/10"
            />
            <MetricCompact
              icon={CheckCircle2}
              label="Activos"
              value={activeCount}
              iconClassName="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-500/10"
            />
            <MetricCompact
              icon={CircleOff}
              label="Inactivos"
              value={inactiveCount}
              iconClassName="text-muted-foreground"
              iconBg="bg-muted"
            />
          </section>

          <div className="grid items-start gap-3 lg:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <Card className="flex flex-col overflow-hidden rounded-lg border-border/50 py-0 shadow-sm">
              <CardHeader className="shrink-0 gap-2 space-y-0 border-b border-border/50 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">
                    Sistemas cliente
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {systems.length === 0
                      ? 'Sin registros'
                      : `${systems.length} registro${systems.length === 1 ? '' : 's'}`}
                  </CardDescription>
                </div>

                {systems.length > 0 ? (
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar sistema..."
                      className="h-8 rounded-md border-border/60 bg-background pl-8 text-sm"
                    />
                  </div>
                ) : null}
              </CardHeader>

              <CardContent className="flex min-h-0 flex-1 flex-col p-2">
                {systems.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-6">
                    <EmptyState
                      title="Sin sistemas cliente"
                      description="Registra el primer sistema para conectar fuentes de eventos y configurar tokens."
                    />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-6">
                    <EmptyState
                      title="Sin resultados"
                      description={`No hay sistemas que coincidan con "${search}".`}
                    />
                  </div>
                ) : (
                  <div className="max-h-[min(65vh,520px)] space-y-0.5 overflow-y-auto">
                    {filtered.map((system) => (
                      <SystemListItem
                        key={system.id}
                        system={system}
                        isSelected={system.id === detailSystem?.id}
                        onSelect={setDetailSystem}
                        onEdit={(item) => {
                          setSelected(item);
                          setOpen(true);
                        }}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              {!detailSystem ? (
                <Card className="flex min-h-[240px] items-center justify-center rounded-lg border-border/50 py-0 shadow-sm">
                  <EmptyState
                    title="Selecciona un sistema"
                    description="Elige un sistema de la lista para ver su información y tokens de integración."
                  />
                </Card>
              ) : (
                <>
                  <Card className="rounded-lg border-border/50 py-0 shadow-sm">
                    <CardHeader className="border-b border-border/50 px-3 py-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <CardTitle className="text-sm font-semibold">
                          {detailSystem.name}
                        </CardTitle>
                        <Badge variant="outline" className="h-5 font-mono text-[10px]">
                          {detailSystem.code}
                        </Badge>
                        <StatusBadge active={detailSystem.active} />
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 py-2.5">
                      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                        <DetailField label="Nombre" value={detailSystem.name} />
                        <DetailField
                          label="Código"
                          value={detailSystem.code}
                          mono
                        />
                        <DetailField
                          label="Estado"
                          value={detailSystem.active ? 'Activo' : 'Inactivo'}
                        />
                        <DetailField
                          label="Descripción"
                          value={detailSystem.description || '—'}
                        />
                        <DetailField
                          label="Creado por"
                          value={detailSystem.createdBy || '—'}
                        />
                        <DetailField
                          label="Fecha creación"
                          value={formatDate(detailSystem.createdAt)}
                        />
                        <DetailField
                          label="Actualizado por"
                          value={detailSystem.updatedBy || '—'}
                        />
                        <DetailField
                          label="Última actualización"
                          value={formatDate(detailSystem.updatedAt)}
                        />
                      </dl>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden rounded-lg border-border/50 py-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/50 px-3 py-2.5">
                      <div>
                        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                          <KeyRound className="size-3.5 text-muted-foreground" />
                          Tokens de integración
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Genera tokens para consumir la API.
                        </CardDescription>
                      </div>
                      {tokens.length > 0 ? (
                        <Button
                          size="sm"
                          onClick={() => setTokenDialogOpen(true)}
                          className="shrink-0 gap-1.5"
                        >
                          <Plus className="size-3.5" />
                          Generar token
                        </Button>
                      ) : null}
                    </CardHeader>
                    <CardContent className="p-2.5">
                      {isLoadingTokens ? (
                        <LoadingTable />
                      ) : tokens.length === 0 ? (
                        <div className="flex flex-col items-center gap-2.5 py-4">
                          <EmptyState
                            title="No existen tokens"
                            description="Genera el primer token para comenzar a consumir la API."
                          />
                          <Button
                            size="sm"
                            onClick={() => setTokenDialogOpen(true)}
                            className="gap-1.5"
                          >
                            <Plus className="size-3.5" />
                            Generar token
                          </Button>
                        </div>
                      ) : (
                        <DataTable
                          columns={tokenColumns}
                          data={tokens}
                          searchColumn="token"
                          searchPlaceholder="Buscar por referencia..."
                        />
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
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

      {detailSystem ? (
        <>
          <ClientSystemTokenFormDialog
            open={tokenDialogOpen}
            onOpenChange={setTokenDialogOpen}
            isSubmitting={isGenerating}
            onSubmit={(values) => {
              generate(
                {
                  clientSystemId: detailSystem.id,
                  data: values,
                },
                {
                  onSuccess: (response) => {
                    setPlainToken(response.token);
                    setCreatedDialogOpen(true);
                    setTokenDialogOpen(false);
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
            token={selectedToken}
            clientSystem={detailSystem}
            open={tokenDetailOpen}
            onOpenChange={setTokenDetailOpen}
            onRevoke={handleRevoke}
            isRevoking={isRevoking}
          />
        </>
      ) : null}
    </main>
  );
}

function MetricCompact({
  icon: Icon,
  label,
  value,
  iconClassName,
  iconBg,
}: {
  icon: typeof Server;
  label: string;
  value: number;
  iconClassName: string;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-md',
          iconBg,
        )}
      >
        <Icon className={cn('size-3.5', iconClassName)} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-semibold tabular-nums leading-none">{value}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn('truncate text-xs', mono && 'font-mono')}>{value}</dd>
    </div>
  );
}

function SystemListItem({
  system,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  system: ClientSystem;
  isSelected: boolean;
  onSelect: (item: ClientSystem) => void;
  onEdit: (item: ClientSystem) => void;
  onDelete: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(system)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(system);
          }
        }}
        className={cn(
          'group flex w-full cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors',
          'hover:border-primary/30 hover:bg-muted/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-transparent bg-transparent',
        )}
      >
        <div
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-md',
            system.active
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
          )}
        >
          <Server className="size-3.5" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium leading-tight">
                {system.name}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1">
                <Badge variant="outline" className="h-4 px-1 font-mono text-[9px]">
                  {system.code}
                </Badge>
                <StatusBadge active={system.active} />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                      onClick={(event) => event.stopPropagation()}
                    />
                  }
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Acciones</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(event) => event.stopPropagation()}
                >
                  <DropdownMenuItem onClick={() => onEdit(system)}>
                    <Pencil className="size-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ChevronRight
                className={cn(
                  'size-3.5 text-muted-foreground',
                  isSelected && 'text-primary',
                )}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar sistema cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el sistema &quot;{system.name}&quot; y su
              configuración asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(system.id)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ClientSystemsPageSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 divide-x overflow-hidden rounded-lg border border-border/50">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 px-3 py-2">
            <Skeleton className="size-7 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card className="rounded-lg border-border/50 py-0 shadow-sm">
          <CardHeader className="gap-2 space-y-0 border-b border-border/50 px-3 py-2.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-full rounded-md" />
          </CardHeader>
          <CardContent className="space-y-0.5 p-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full rounded-md" />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="rounded-lg border-border/50 py-0 shadow-sm">
            <CardHeader className="border-b border-border/50 px-3 py-2.5">
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="grid gap-2 px-3 py-2.5 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-1">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border-border/50 py-0 shadow-sm">
            <CardHeader className="border-b border-border/50 px-3 py-2.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-1 h-3 w-48" />
            </CardHeader>
            <CardContent className="p-2.5">
              <Skeleton className="h-24 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
