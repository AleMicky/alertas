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
import { cn } from '@/lib/utils';
import { AdminGuard } from '@/features/auth/components/admin-guard';
import { RoleFormDialog } from '@/features/roles/components/role-form-dialog';
import { useRolesMutations } from '@/features/roles/hooks/use-roles-mutations';
import { useRolesQuery } from '@/features/roles/hooks/use-roles-query';
import type { CreateRoleDto } from '@/features/roles/role.schema';
import type { Role } from '@/features/roles/role.types';
import { ConfirmDeleteDialog, LoadingTable } from '@/shared/components';

function roleCodeBadgeVariant(code: string): 'outline' | 'secondary' {
  return code.toUpperCase() === 'ADMIN' ? 'outline' : 'secondary';
}

interface RolesListSectionProps {
  data: Role[];
  onEdit: (item: Role) => void;
  onDelete: (id: string) => void;
}

function RolesListSection({ data, onEdit, onDelete }: RolesListSectionProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: 'code',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Código
            <ArrowUpDown className="ml-1.5 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge
            variant={roleCodeBadgeVariant(row.original.code)}
            className="h-5 px-1.5 text-[10px] font-medium uppercase tracking-wide"
          >
            {row.original.code}
          </Badge>
        ),
      },
      {
        accessorKey: 'name',
        header: () => (
          <span className="text-xs font-medium text-muted-foreground">Nombre</span>
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'active',
        header: () => (
          <span className="text-xs font-medium text-muted-foreground">Estado</span>
        ),
        cell: ({ row }) => {
          const active = row.original.active ?? true;

          return (
            <Badge
              variant={active ? 'success' : 'info'}
              className="h-5 px-1.5 text-[10px] font-medium"
            >
              {active ? 'Activo' : 'Inactivo'}
            </Badge>
          );
        },
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
                className="h-7 gap-1 px-2.5 text-xs transition-colors duration-150"
                onClick={() => onEdit(item)}
              >
                <Edit className="size-3" />
                Editar
              </Button>

              <div
                className={cn(
                  '[&_button]:h-7 [&_button]:border-transparent [&_button]:bg-destructive/10',
                  '[&_button]:px-2.5 [&_button]:text-xs [&_button]:text-destructive [&_button]:shadow-none',
                  '[&_button]:transition-colors [&_button]:duration-150',
                  'hover:[&_button]:bg-destructive/15',
                )}
              >
                <ConfirmDeleteDialog
                  title="¿Eliminar rol?"
                  description="Esta acción eliminará el rol del catálogo."
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

  const roleCount = data.length;
  const roleCountLabel = `${roleCount} rol${roleCount === 1 ? '' : 'es'}`;

  return (
    <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm">
      <CardHeader className="gap-2.5 space-y-0 border-b border-border/50 px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Roles
          </CardTitle>
          <CardDescription className="text-xs tabular-nums text-muted-foreground">
            {roleCountLabel}
          </CardDescription>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Buscar rol..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="h-8 rounded-md border-border/60 bg-background pl-8 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
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

        <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
          <p className="text-xs text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs transition-colors duration-150 disabled:opacity-40"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs transition-colors duration-150 disabled:opacity-40"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Role | null>(null);

  const { data: roles, isLoading } = useRolesQuery();
  const { create, update, remove, isCreating, isUpdating } = useRolesMutations();
  const isSubmitting = isCreating || isUpdating;

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSubmit = (values: CreateRoleDto) => {
    if (selected) {
      update(
        { id: selected.id, data: values },
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

  return (
    <AdminGuard>
      <main className="space-y-3">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Roles
            </h1>
            <p className="text-xs text-muted-foreground">
              Catálogo de roles y permisos del sistema.
            </p>
          </div>

          <Button
            onClick={handleCreate}
            size="sm"
            className="shrink-0 gap-1.5 transition-colors duration-150"
          >
            <Plus className="size-3.5" />
            Nuevo
          </Button>
        </header>

        {isLoading ? (
          <Card className="overflow-hidden rounded-lg border-border/50 bg-card py-0 shadow-sm">
            <CardHeader className="border-b border-border/50 px-4 py-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent className="px-4 py-3">
              <LoadingTable />
            </CardContent>
          </Card>
        ) : (
          <RolesListSection
            data={roles}
            onEdit={(item) => {
              setSelected(item);
              setOpen(true);
            }}
            onDelete={(id) => remove(id)}
          />
        )}

        <RoleFormDialog
          open={open}
          onOpenChange={setOpen}
          initialData={selected}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </main>
    </AdminGuard>
  );
}
