'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';
import { notificationChannelService } from '../notification-channel.service';
import { NotificationChannel } from '../notification-channel.types';

export function useNotificationChannelsQuery() {

    return useBaseEntityQuery<NotificationChannel>(notificationChannelService, {
        queryKey: QUERY_KEYS.notificationChannels,
    });

}