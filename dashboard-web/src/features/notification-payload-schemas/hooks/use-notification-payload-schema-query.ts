'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationPayloadSchemaService } from '../notification-payload-schema.service';
import { NotificationPayloadSchema } from '../notification-payload-schema.types';

export function useNotificationPayloadSchemasQuery(channelId?: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.notificationPayloadSchemas, channelId ?? 'all'],
    queryFn: (): Promise<NotificationPayloadSchema[]> =>
      channelId
        ? notificationPayloadSchemaService.getByChannel(channelId)
        : notificationPayloadSchemaService.getAll(),
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
