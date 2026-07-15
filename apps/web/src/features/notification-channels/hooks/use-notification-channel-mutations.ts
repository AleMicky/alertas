'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';
import { notificationChannelService } from '../notification-channel.service';
import { NotificationChannel } from '../notification-channel.types';
import { CreateNotificationChannelDto, UpdateNotificationChannelDto } from '../notification-channel.schema';

export function useNotificationChannelsMutations() {

    return useBaseEntityMutations<
        NotificationChannel,
        CreateNotificationChannelDto,
        UpdateNotificationChannelDto
    >(
        notificationChannelService,
        {
            queryKey:
                QUERY_KEYS.notificationChannels,

            entityName:
                'Canal de notificación',
        },
    );
}