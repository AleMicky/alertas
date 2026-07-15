'use client';

import { useState } from 'react';
import {
  ChevronRight,
  MoreHorizontal,
  Pencil,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/shared/components/status-badge';
import { cn } from '@/lib/utils';
import { formatDate } from '@/shared/utils/format-date';

import { ClientSystem } from '../../types/client-system.types';

interface Props {
  system: ClientSystem;
  isSelected: boolean;
  onSelect: (item: ClientSystem) => void;
  onEdit: (item: ClientSystem) => void;
  onDelete: (id: string) => void;
}

export function ClientSystemCard({
  system,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
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
        'group relative flex w-full cursor-pointer gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-all sm:p-4',
        'hover:border-primary/40 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        isSelected && 'border-primary ring-2 ring-primary/20',
      )}
    >
      <div
        className={cn(
          'absolute inset-y-3 left-0 w-1 rounded-r-full',
          system.active ? 'bg-emerald-500' : 'bg-muted-foreground/40',
        )}
      />

      <div
        className={cn(
          'ml-2 flex size-10 shrink-0 items-center justify-center rounded-xl',
          system.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        <Server className="size-5" aria-hidden />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-sm font-semibold leading-snug sm:text-base">
              {system.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-[10px] sm:text-xs">
                {system.code}
              </Badge>
              <StatusBadge active={system.active} />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-70 transition-opacity hover:opacity-100"
                    onClick={(event) => event.stopPropagation()}
                  />
                }
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Acciones</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
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
                'size-4 text-muted-foreground transition-transform',
                'group-hover:translate-x-0.5 group-hover:text-primary',
                isSelected && 'translate-x-0.5 text-primary',
              )}
              aria-hidden
            />
          </div>
        </div>

        {system.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {system.description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground/70">
            Sin descripción
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Actualizado {formatDate(system.updatedAt)}
          {system.updatedBy ? ` · ${system.updatedBy}` : ''}
        </p>
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
