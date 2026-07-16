'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { systemNotificationService } from '../system-notification.service';

const POLL_INTERVAL_MS = 10_000;

export function useSystemNotificationsQuery(options?: {
  limit?: number;
  unreadOnly?: boolean;
}) {
  return useQuery({
    queryKey: [
      QUERY_KEYS.systemNotifications,
      'list',
      options?.limit ?? 20,
      options?.unreadOnly ?? false,
    ],
    queryFn: () => systemNotificationService.list(options),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useSystemNotificationUnreadCountQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.systemNotifications, 'unread-count'],
    queryFn: () => systemNotificationService.unreadCount(),
    refetchInterval: POLL_INTERVAL_MS,
  });
}
