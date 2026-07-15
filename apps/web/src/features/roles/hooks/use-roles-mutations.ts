'use client';

import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { roleService } from '../role.service';
import type { CreateRoleDto, UpdateRoleDto } from '../role.schema';
import type { Role } from '../role.types';

export function useRolesMutations() {
  return useBaseEntityMutations<Role, CreateRoleDto, UpdateRoleDto>(
    roleService,
    { queryKey: QUERY_KEYS.roles, entityName: 'Rol' },
  );
}
