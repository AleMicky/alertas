import { Controller } from '@nestjs/common';
import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { NotificationChannelsService } from 'src/app/services/notification-channels.service';
import { NotificationChannelResponseSchema } from '../schemas';
import { CreateNotificationChannelDto, UpdateNotificationChannelDto } from '../dto/notification-channel';

@Controller('notification-channels')
@ApiCrudDoc({
  tag: 'Canales de notificación',
  createDto: CreateNotificationChannelDto,
  updateDto: UpdateNotificationChannelDto,
  responseDto: NotificationChannelResponseSchema,
})
export class NotificationChannelsController extends BaseController<
  NotificationChannel,
  CreateNotificationChannelDto,
  UpdateNotificationChannelDto
> {
  constructor(
    private readonly notificationChannelsService: NotificationChannelsService,
  ) {
    super(notificationChannelsService);
  }
}
