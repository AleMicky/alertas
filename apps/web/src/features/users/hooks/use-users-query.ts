'use client';

import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { userService } from '../user.service';
import type { User } from '../user.types';

export function useUsersQuery() {
  return useBaseEntityQuery<User>(userService, {
    queryKey: QUERY_KEYS.users,
  });
}
