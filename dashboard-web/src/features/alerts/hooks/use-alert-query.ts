'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { alertService } from '../alert.service';

const REFRESH_INTERVAL_MS = 15_000;

export function useAlertQuery() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.alerts],
    queryFn: alertService.getAll,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
