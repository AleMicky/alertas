'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { alertNotificationService } from '../alert-notification.service';

const REFRESH_INTERVAL_MS = 15_000;

export function useAlertNotificationsQuery() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.alertNotifications],
    queryFn: alertNotificationService.getAll,
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

export function useAlertNotificationsByAlert(alertId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.alertNotifications, 'by-alert', alertId],
    queryFn: () => alertNotificationService.getByAlertId(alertId!),
    enabled: Boolean(alertId),
  });
}
