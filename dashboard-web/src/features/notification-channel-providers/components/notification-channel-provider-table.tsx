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
import {
  ArrowUpDown,
  CheckCircle2,
  Edit,
  FlaskConical,
  Plus,
  Power,
  PowerOff,
  Search,
  ShieldCheck,
  Webhook,
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { ConfirmDeleteDialog } from '@/shared/components';
import { cn } from '@/lib/utils';
import { formatDate } from '@/shared/utils/format-date';

import { NotificationChannelProvider } from '../notification-channel-provider.types';

interface Props {
  data: NotificationChannelProvider[];
  channels: NotificationChannel[];
  onCreate?: () => void;
  onEdit: (item: NotificationChannelProvider) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onTest: (item: NotificationChannelProvider) => void;
  onValidate: (id: string) => void;
  isActivating?: boolean;
  isDeactivating?: boolean;
}

export function NotificationChannelProviderTable({
  data,
  channels,
  onCreate,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onTest,
  onValidate,
  isActivating,
  isDeactivating,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const channelById = useMemo(
    () => new Map(channels.map((channel) => [channel.id, channel])),
    [channels],
  );

  const columns = useMemo<ColumnDef<NotificationChannelProvider>[]>(
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
        header: 'Nombre',
        cell: ({ row }) => (
          <span className="min-w-[120px] font-medium text-foreground">
            {row.original.name}
          </span>
        ),
      },
      {
        id: 'channel',
        header: 'Canal',
        cell: ({ row }) => {
          const channel = channelById.get(row.original.notificationChannelId);

          if (!channel) {
            return (
              <span className="text-xs text-muted-foreground">
                Canal no disponible
              </span>
            );
          }

          return (
            <div className="min-w-[100px]">
              <p className="text-xs font-medium text-foreground">
                {channel.name}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {channel.code}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'webhookUrl',
        header: 'Webhook',
        cell: ({ row }) => (
          <span
            className="block max-w-[200px] truncate font-mono text-[11px] text-muted-foreground"
            title={row.original.webhookUrl}
          >
            {row.original.webhookUrl}
          </span>
        ),
      },
      {
        accessorKey: 'authType',
        header: 'Auth',
        cell: ({ row }) => (
          <Badge variant="outline" className="text-[10px]">
            {row.original.authType}
          </Badge>
        ),
      },
      {
        accessorKey: 'active',
        header: 'Estado',
        cell: ({ row }) =>
          row.original.active ? (
            <Badge className="gap-1 bg-emerald-600/90 text-[10px] hover:bg-emerald-600">
              <CheckCircle2 className="size-3" />
              Activo
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px]">
              Inactivo
            </Badge>
          ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Actualizado',
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground">
            <p>{formatDate(row.original.updatedAt)}</p>
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
            <div className="flex flex-wrap items-center justify-end gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={() => onValidate(item.id)}
                title="Validar configuración"
              >
                <ShieldCheck className="size-3" />
                Validar
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={() => onTest(item)}
                title="Probar webhook"
              >
                <FlaskConical className="size-3" />
                Probar
              </Button>

              {item.active ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
                  onClick={() => onDeactivate(item.id)}
                  disabled={isDeactivating}
                  title="Desactivar proveedor"
                >
                  <PowerOff className="size-3" />
                  Desactivar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
                  onClick={() => onActivate(item.id)}
                  disabled={isActivating}
                  title="Activar proveedor"
                >
                  <Power className="size-3" />
                  Activar
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={() => onEdit(item)}
                title="Editar proveedor"
              >
                <Edit className="size-3" />
                Editar
              </Button>

              <div
                className={cn(
                  '[&_button]:h-7 [&_button]:border-transparent [&_button]:bg-destructive/10',
                  '[&_button]:px-2 [&_button]:text-xs [&_button]:text-destructive [&_button]:shadow-none',
                  '[&_button]:transition-colors [&_button]:duration-150',
                  '[&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-destructive/30',
                  'hover:[&_button]:bg-destructive/15',
                )}
              >
                <ConfirmDeleteDialog
                  title="¿Eliminar proveedor?"
                  description={`Se eliminará el proveedor "${item.name}".`}
                  onConfirm={() => onDelete(item.id)}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [
      channelById,
      isActivating,
      isDeactivating,
      onActivate,
      onDeactivate,
      onDelete,
      onEdit,
      onTest,
      onValidate,
    ],
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

  const providerCount = data.length;
  const providerCountLabel = `${providerCount} proveedor${providerCount === 1 ? '' : 'es'}`;

  return (
    <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm shadow-black/3 dark:shadow-black/20">
      <CardHeader className="gap-2 space-y-0 border-b border-border/50 px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Proveedores configurados
          </CardTitle>
          <CardDescription className="text-xs tabular-nums text-muted-foreground">
            {providerCountLabel}
          </CardDescription>
        </div>

        {providerCount > 0 ? (
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
        {providerCount === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted/40 shadow-sm">
              <Webhook className="size-4 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              Sin proveedores
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Conecta un canal con su webhook para empezar a enviar
              notificaciones de alertas.
            </p>
            {onCreate ? (
              <Button
                size="sm"
                className="mt-4 gap-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={onCreate}
              >
                <Plus className="size-3.5" />
                Crear proveedor
              </Button>
            ) : null}
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
                  {table.getRowModel().rows.map((row) => (
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
                  ))}
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
