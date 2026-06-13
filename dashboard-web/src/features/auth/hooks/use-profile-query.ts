'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { authService } from '../auth.service';

export function useProfileQuery() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.profile],
    queryFn: authService.me,
  });

  return {
    data: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
