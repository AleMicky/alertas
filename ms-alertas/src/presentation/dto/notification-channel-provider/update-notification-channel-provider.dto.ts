import { PartialType, OmitType } from '@nestjs/swagger';

import { CreateNotificationChannelProviderDto } from './create-notification-channel-provider.dto';

export class UpdateNotificationChannelProviderDto extends PartialType(
  OmitType(CreateNotificationChannelProviderDto, [
    'notificationChannelId',
    'code',
  ] as const),
) {}
