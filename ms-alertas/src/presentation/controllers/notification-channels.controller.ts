import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { NotificationChannelType } from 'src/domain/enums/notification-channel-type.enum';
import { NotificationChannelsService } from 'src/app/services/notification-channels.service';
import { NotificationChannelResponseSchema } from '../schemas';
import {
  CreateNotificationChannelDto,
  UpdateNotificationChannelDto,
} from '../dto/notification-channel';

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

  @Get('code/:code')
  @ApiOperation({ summary: 'Obtener canal por código' })
  @ApiParam({ name: 'code', example: 'TELEGRAM_OPS' })
  @ApiOkResponse({ type: NotificationChannelResponseSchema })
  findByCode(@Param('code') code: string) {
    return this.notificationChannelsService.findByCode(code);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Listar canales activos por tipo' })
  @ApiParam({
    name: 'type',
    enum: NotificationChannelType,
    example: NotificationChannelType.TELEGRAM,
  })
  @ApiOkResponse({ type: [NotificationChannelResponseSchema] })
  findActiveByType(@Param('type') type: NotificationChannelType) {
    return this.notificationChannelsService.findActiveByType(type);
  }
}
