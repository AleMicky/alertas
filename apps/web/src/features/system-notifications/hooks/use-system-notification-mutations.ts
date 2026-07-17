'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { systemNotificationService } from '../system-notification.service';

export function useSystemNotificationMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.systemNotifications],
    });
  };

  const markAsRead = useMutation({
    mutationFn: systemNotificationService.markAsRead,
    onSuccess: () => {
      invalidate();
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: systemNotificationService.markAllAsRead,
    onSuccess: () => {
      invalidate();
    },
  });

  return {
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
  };
}
