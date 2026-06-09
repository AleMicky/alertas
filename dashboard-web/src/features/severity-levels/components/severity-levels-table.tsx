'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table';

import { SeverityLevel } from '../severity-level.types';
import { createSeverityLevelColumns } from './severity-levels-columns';

interface Props {
  data: SeverityLevel[];
  onEdit: (item: SeverityLevel) => void;
  onDelete: (id: string) => void;
}

export function SeverityLevelsTable({ data, onEdit, onDelete }: Props) {
  const columns = createSeverityLevelColumns({
    onEdit,
    onDelete,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles de severidad</CardTitle>
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