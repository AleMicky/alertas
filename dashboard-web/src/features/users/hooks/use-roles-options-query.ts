'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { roleService } from '@/features/roles/role.service';

export function useRolesOptionsQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.roles],
    queryFn: () => roleService.getAll(),
  });
}
