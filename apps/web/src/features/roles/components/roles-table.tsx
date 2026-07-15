'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table';
import type { Role } from '../role.types';
import { createRoleColumns } from './role-columns';

interface Props {
  data: Role[];
  onEdit: (item: Role) => void;
  onDelete: (id: string) => void;
}

export function RolesTable({ data, onEdit, onDelete }: Props) {
  const columns = createRoleColumns({ onEdit, onDelete });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchColumn="name"
          searchPlaceholder="Buscar por nombre..."
        />
      </CardContent>
    </Card>
  );
}
