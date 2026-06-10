import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateNotificationProviderDto } from './create-notification-provider.dto';

export class UpdateNotificationProviderDto extends PartialType(
  OmitType(CreateNotificationProviderDto, [
    'code',
    'clientSystemId',
    'notificationChannelId',
  ] as const),
) {}
