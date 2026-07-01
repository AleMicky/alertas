'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Edit, Plus, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NotificationChannelFormDialog } from '@/features/notification-channels/components/notification-channel-form-dialog';
import { useNotificationChannelsMutations } from '@/features/notification-channels/hooks/use-notification-channel-mutations';
import { useNotificationChannelsQuery } from '@/features/notification-channels/hooks/use-notification-channel-query';
import { CreateNotificationChannelDto } from '@/features/notification-channels/notification-channel.schema';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { cn } from '@/lib/utils';
import { ConfirmDeleteDialog, EmptyState, LoadingTable } from '@/shared/components';
import { formatDate } from '@/shared/utils/format-date';

interface NotificationChannelsListSectionProps {
  data: NotificationChannel[];
  onDelete: (id: string) => void;
  onEdit: (item: NotificationChannel) => void;
}

function NotificationChannelsListSection({
  data,
  onDelete,
  onEdit,
}: NotificationChannelsListSectionProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<NotificationChannel>[]>(
    () => [
      {
        accessorKey: 'code',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Código
            <ArrowUpDown className="ml-1.5 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="h-5 border-border/60 bg-muted/40 px-1.5 font-mono text-[10px] font-medium tracking-wide text-foreground"
          >
            {row.original.code}
          </Badge>
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre
            <ArrowUpDown className="ml-1.5 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="min-w-[120px] font-medium text-foreground">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: () => (
          <span className="text-xs font-medium text-muted-foreground">Actualizado</span>
        ),
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground">
            <p>{formatDate(row.original.updatedAt)}</p>
            {row.original.updatedBy ? (
              <p className="text-[11px] opacity-80">{row.original.updatedBy}</p>
            ) : null}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => (
          <span className="block text-right text-xs font-medium text-muted-foreground">
            Acciones
          </span>
        ),
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2.5 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={() => onEdit(item)}
                title="Editar canal"
              >
                <Edit className="size-3" />
                Editar
              </Button>

              <div
                className={cn(
                  '[&_button]:h-7 [&_button]:border-transparent [&_button]:bg-destructive/10',
                  '[&_button]:px-2.5 [&_button]:text-xs [&_button]:text-destructive [&_button]:shadow-none',
                  '[&_button]:transition-colors [&_button]:duration-150',
                  '[&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-destructive/30',
                  'hover:[&_button]:bg-destructive/15',
                )}
              >
                <ConfirmDeleteDialog
                  title="¿Eliminar canal?"
                  description={`Se eliminará el canal "${item.name}" y dejará de recibir alertas.`}
                  onConfirm={() => onDelete(item.id)}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [onDelete, onEdit],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const channelCount = data.length;
  const channelCountLabel = `${channelCount} canal${channelCount === 1 ? '' : 'es'}`;

  return (
    <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm shadow-black/3 dark:shadow-black/20">
      <CardHeader className="gap-2.5 space-y-0 border-b border-border/50 px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Canales configurados
          </CardTitle>
          <CardDescription className="text-xs tabular-nums text-muted-foreground">
            {channelCountLabel}
          </CardDescription>
        </div>

        {channelCount > 0 ? (
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Buscar por nombre o código..."
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="h-8 rounded-md border-border/60 bg-background pl-8 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="p-0">
        {channelCount === 0 ? (
          <div className="px-4 py-6">
            <EmptyState
              title="Sin canales de notificación"
              description="Registra el primer canal de notificación para comenzar."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-border/50 bg-muted/30 hover:bg-muted/30"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="h-8 px-3 py-0 align-middle"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-b border-border/40 transition-colors duration-150 hover:bg-muted/40"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-3 py-2 text-sm align-middle"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={columns.length}
                        className="h-16 px-3 text-center text-sm text-muted-foreground"
                      >
                        Sin registros.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-2 border-t border-border/50 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Página {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount()}
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function NotificationChannelsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<NotificationChannel | null>(null);

  const { data: notificationChannels, isLoading } = useNotificationChannelsQuery();
  const { create, update, remove, isCreating, isUpdating } =
    useNotificationChannelsMutations();

  const channels = useMemo(() => notificationChannels ?? [], [notificationChannels]);
  const isSubmitting = isCreating || isUpdating;

  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (channel: NotificationChannel) => {
    setSelected(channel);
    setFormOpen(true);
  };

  const handleSubmit = (values: CreateNotificationChannelDto) => {
    if (selected) {
      const { code: _code, ...data } = values;

      update(
        { id: selected.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelected(null);
          },
        },
      );

      return;
    }

    create(values, {
      onSuccess: () => {
        setFormOpen(false);
        setSelected(null);
      },
    });
  };

  return (
    <main className="space-y-3">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Canales de notificación
          </h1>
          <p className="text-xs text-muted-foreground">
            Administra los canales disponibles para enviar alertas.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          size="sm"
          className="shrink-0 gap-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Plus className="size-3.5" />
          Nuevo canal
        </Button>
      </header>

      {isLoading ? (
        <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm shadow-black/3 dark:shadow-black/20">
          <CardHeader className="border-b border-border/50 px-4 py-3">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="px-4 py-3">
            <LoadingTable />
          </CardContent>
        </Card>
      ) : (
        <NotificationChannelsListSection
          data={channels}
          onDelete={(id) => remove(id)}
          onEdit={handleEdit}
        />
      )}

      <NotificationChannelFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelected(null);
          }
        }}
        initialData={selected}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
