'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationRequestService } from '../notification-request.service';
import { NotificationRequestStatsFilters } from '../notification-request.types';

export function useNotificationRequestStatsQuery(
  filters: NotificationRequestStatsFilters = {},
) {
  return useQuery({
    queryKey: [QUERY_KEYS.notificationRequests, 'stats', filters],
    queryFn: () => notificationRequestService.getStats(filters),
  });
}
