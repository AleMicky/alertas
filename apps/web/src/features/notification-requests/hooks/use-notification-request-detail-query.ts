'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationRequestService } from '../notification-request.service';
import {
  isNotificationRequestInFlight,
  NOTIFICATION_REQUEST_DETAIL_POLL_MS,
} from '../notification-request.utils';

export function useNotificationRequestDetailQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.notificationRequests, 'detail', id],
    queryFn: () => notificationRequestService.getById(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.request.status;

      if (!status || !isNotificationRequestInFlight(status)) {
        return false;
      }

      return NOTIFICATION_REQUEST_DETAIL_POLL_MS;
    },
  });
}
