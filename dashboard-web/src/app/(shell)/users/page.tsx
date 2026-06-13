'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/features/auth/components/admin-guard';
import { UserFormDialog } from '@/features/users/components/user-form-dialog';
import { UsersTable } from '@/features/users/components/users-table';
import { useUsersMutations } from '@/features/users/hooks/use-users-mutations';
import { useUsersQuery } from '@/features/users/hooks/use-users-query';
import type { CreateUserDto } from '@/features/users/user.schema';
import type { User } from '@/features/users/user.types';
import { LoadingTable, PageHeader } from '@/shared/components';

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const { data: users, isLoading } = useUsersQuery();
  const { create, update, remove, isCreating, isUpdating } = useUsersMutations();
  const isSubmitting = isCreating || isUpdating;

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleSubmit = (values: CreateUserDto) => {
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
          title="Usuarios"
          description="Gestiona las cuentas de acceso al dashboard."
          action={<Button onClick={handleCreate}>Nuevo</Button>}
        />

        {isLoading ? (
          <LoadingTable />
        ) : (
          <UsersTable
            data={users}
            onEdit={(item) => {
              setSelected(item);
              setOpen(true);
            }}
            onDelete={(id) => remove(id)}
          />
        )}

        <UserFormDialog
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
