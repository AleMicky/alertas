'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationRequestService } from '../notification-request.service';
import { NotificationRequestStatsFilters } from '../notification-request.types';
import { NOTIFICATION_REQUEST_LIST_POLL_MS } from '../notification-request.utils';

export function useNotificationRequestStatsQuery(
  filters: NotificationRequestStatsFilters = {},
  options?: { refetchIntervalMs?: number | false },
) {
  return useQuery({
    queryKey: [QUERY_KEYS.notificationRequests, 'stats', filters],
    queryFn: () => notificationRequestService.getStats(filters),
    refetchInterval:
      options?.refetchIntervalMs ?? NOTIFICATION_REQUEST_LIST_POLL_MS,
  });
}
