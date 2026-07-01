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
  Braces,
  CheckCircle2,
  Edit,
  Plus,
  Power,
  PowerOff,
  Search,
  ShieldCheck,
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

import { NotificationPayloadSchema } from '../notification-payload-schema.types';

interface Props {
  data: NotificationPayloadSchema[];
  channels: NotificationChannel[];
  onCreate?: () => void;
  onEdit: (item: NotificationPayloadSchema) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onValidate: (item: NotificationPayloadSchema) => void;
  isActivating?: boolean;
  isDeactivating?: boolean;
}

export function NotificationPayloadSchemaTable({
  data,
  channels,
  onCreate,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
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

  const columns = useMemo<ColumnDef<NotificationPayloadSchema>[]>(
    () => [
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
        accessorKey: 'version',
        header: 'Versión',
        cell: ({ row }) => (
          <Badge variant="outline" className="font-mono text-[10px]">
            v{row.original.version}
          </Badge>
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
        id: 'requiredFields',
        header: 'Requeridos',
        cell: ({ row }) => (
          <div className="flex max-w-[220px] flex-wrap gap-1">
            {row.original.requiredFields.map((field) => (
              <Badge
                key={field}
                variant="secondary"
                className="font-mono text-[10px]"
              >
                {field}
              </Badge>
            ))}
          </div>
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
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => onValidate(item)}
                title="Validar payload"
              >
                <ShieldCheck className="size-3" />
                Validar
              </Button>

              {item.active ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs"
                  onClick={() => onDeactivate(item.id)}
                  disabled={isDeactivating}
                  title="Desactivar schema"
                >
                  <PowerOff className="size-3" />
                  Desactivar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs"
                  onClick={() => onActivate(item.id)}
                  disabled={isActivating}
                  title="Activar schema"
                >
                  <Power className="size-3" />
                  Activar
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => onEdit(item)}
                title="Editar schema"
              >
                <Edit className="size-3" />
                Editar
              </Button>

              <div
                className={cn(
                  '[&_button]:h-7 [&_button]:border-transparent [&_button]:bg-destructive/10',
                  '[&_button]:px-2 [&_button]:text-xs [&_button]:text-destructive [&_button]:shadow-none',
                  'hover:[&_button]:bg-destructive/15',
                )}
              >
                <ConfirmDeleteDialog
                  title="¿Eliminar schema?"
                  description={`Se eliminará el schema "${item.name}" v${item.version}.`}
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

  const schemaCount = data.length;
  const schemaCountLabel = `${schemaCount} schema${schemaCount === 1 ? '' : 's'}`;

  return (
    <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm shadow-black/3 dark:shadow-black/20">
      <CardHeader className="gap-2 space-y-0 border-b border-border/50 px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Schemas configurados
          </CardTitle>
          <CardDescription className="text-xs tabular-nums text-muted-foreground">
            {schemaCountLabel}
          </CardDescription>
        </div>

        {schemaCount > 0 ? (
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Buscar por nombre..."
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="h-8 rounded-md border-border/60 bg-background pl-8 text-sm"
            />
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="p-0">
        {schemaCount === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted/40 shadow-sm">
              <Braces className="size-4 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              Sin schemas de payload
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Define el JSON Schema que validará los payloads enviados por cada
              canal de notificación.
            </p>
            {onCreate ? (
              <Button size="sm" className="mt-4 gap-1.5" onClick={onCreate}>
                <Plus className="size-3.5" />
                Crear schema
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
                  className="h-7 px-2.5 text-xs"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
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
