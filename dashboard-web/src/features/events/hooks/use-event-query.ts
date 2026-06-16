'use client';

import { useQuery } from '@tanstack/react-query';

import { eventService } from '../event.service';
import { QUERY_KEYS } from '@/shared/constants/query-keys';

const REFRESH_INTERVAL_MS = 15_000;

export function useEventQuery() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.events],
    queryFn: eventService.getAll,
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
