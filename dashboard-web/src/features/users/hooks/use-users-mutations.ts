'use client';

import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { userService } from '../user.service';
import type { CreateUserDto, UpdateUserDto } from '../user.schema';
import type { User } from '../user.types';

export function useUsersMutations() {
  return useBaseEntityMutations<User, CreateUserDto, UpdateUserDto>(
    userService,
    { queryKey: QUERY_KEYS.users, entityName: 'Usuario' },
  );
}
