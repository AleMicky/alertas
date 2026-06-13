'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table';
import type { User } from '../user.types';
import { createUserColumns } from './user-columns';

interface Props {
  data: User[];
  onEdit: (item: User) => void;
  onDelete: (id: string) => void;
}

export function UsersTable({ data, onEdit, onDelete }: Props) {
  const columns = createUserColumns({ onEdit, onDelete });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchColumn="username"
          searchPlaceholder="Buscar por usuario..."
        />
      </CardContent>
    </Card>
  );
}
