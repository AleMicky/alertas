import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { RoleCode } from 'src/domain/enums';
import { NotificationChannelsService } from 'src/app/services/notification-channels.service';
import { Roles } from 'src/infrastructure/security';
import { NotificationChannelResponseSchema } from '../schemas';
import { CreateNotificationChannelDto, UpdateNotificationChannelDto } from '../dto/notification-channel';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
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
