import { baseService } from '@/shared/core/base.service';
import { NotificationChannel } from './notification-channel.types';
import { CreateNotificationChannelDto, UpdateNotificationChannelDto } from './notification-channel.schema';

const endpoint = '/notification-channels';

export const notificationChannelService =
    baseService<
        NotificationChannel,
        CreateNotificationChannelDto,
        UpdateNotificationChannelDto
    >(endpoint);