'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationRequestService } from '../notification-request.service';

export function useNotificationRequestDetailQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.notificationRequests, 'detail', id],
    queryFn: () => notificationRequestService.getById(id!),
    enabled: Boolean(id),
  });
}
