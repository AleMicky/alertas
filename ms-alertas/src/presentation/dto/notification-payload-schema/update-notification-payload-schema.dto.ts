import { PartialType, OmitType } from '@nestjs/swagger';

import { CreateNotificationPayloadSchemaDto } from './create-notification-payload-schema.dto';

export class UpdateNotificationPayloadSchemaDto extends PartialType(
  OmitType(CreateNotificationPayloadSchemaDto, [
    'notificationChannelId',
    'name',
    'version',
  ] as const),
) {}
