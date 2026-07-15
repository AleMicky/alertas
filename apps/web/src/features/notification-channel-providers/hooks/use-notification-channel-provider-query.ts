'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationChannelProviderService } from '../notification-channel-provider.service';
import { NotificationChannelProvider } from '../notification-channel-provider.types';

export function useNotificationChannelProvidersQuery(channelId?: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.notificationChannelProviders, channelId ?? 'all'],
    queryFn: (): Promise<NotificationChannelProvider[]> =>
      channelId
        ? notificationChannelProviderService.getByChannel(channelId)
        : notificationChannelProviderService.getAll(),
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
