'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationRequestService } from '../notification-request.service';
import { NotificationRequestSearchFilters } from '../notification-request.types';

export function useNotificationRequestSearchQuery(
  filters: NotificationRequestSearchFilters,
) {
  return useQuery({
    queryKey: [QUERY_KEYS.notificationRequests, 'search', filters],
    queryFn: () => notificationRequestService.search(filters),
  });
}
