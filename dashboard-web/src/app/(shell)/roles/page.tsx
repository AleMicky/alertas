'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/features/auth/components/admin-guard';
import { RoleFormDialog } from '@/features/roles/components/role-form-dialog';
import { RolesTable } from '@/features/roles/components/roles-table';
import { useRolesMutations } from '@/features/roles/hooks/use-roles-mutations';
import { useRolesQuery } from '@/features/roles/hooks/use-roles-query';
import type { CreateRoleDto } from '@/features/roles/role.schema';
import type { Role } from '@/features/roles/role.types';
import { LoadingTable, PageHeader } from '@/shared/components';

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
      <main className="space-y-4">
        <PageHeader
          title="Roles"
          description="Catálogo de roles y permisos del sistema."
          action={<Button onClick={handleCreate}>Nuevo</Button>}
        />

        {isLoading ? (
          <LoadingTable />
        ) : (
          <RolesTable
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
