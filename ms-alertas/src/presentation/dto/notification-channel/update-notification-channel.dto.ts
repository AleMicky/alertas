import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateNotificationChannelDto } from './create-notification-channel.dto';
 
export class UpdateNotificationChannelDto extends PartialType(
  OmitType(CreateNotificationChannelDto, ['code'] as const),
) {}
