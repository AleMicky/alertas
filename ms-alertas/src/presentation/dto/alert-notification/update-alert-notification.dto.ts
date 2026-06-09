import { PartialType } from '@nestjs/swagger';
import { CreateAlertNotificationDto } from './create-alert-notification.dto';

export class UpdateAlertNotificationDto extends PartialType(
  CreateAlertNotificationDto,
) {}
