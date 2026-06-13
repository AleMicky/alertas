'use client';

import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { roleService } from '../role.service';
import type { Role } from '../role.types';

export function useRolesQuery() {
  return useBaseEntityQuery<Role>(roleService, {
    queryKey: QUERY_KEYS.roles,
  });
}
