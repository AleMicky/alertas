import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { NotificationProvider } from 'src/domain/entities/notification-provider';
import { NotificationProviderService } from 'src/app/services/notification-provider.service';
import {
  CreateNotificationProviderDto,
  UpdateNotificationProviderDto,
} from '../dto/notification-provider';
import { NotificationProviderResponseSchema } from '../schemas';

@Controller('notification-providers')
@ApiCrudDoc({
  tag: 'Proveedores de notificación',
  createDto: CreateNotificationProviderDto,
  updateDto: UpdateNotificationProviderDto,
  responseDto: NotificationProviderResponseSchema,
})
export class NotificationProvidersController extends BaseController<
  NotificationProvider,
  CreateNotificationProviderDto,
  UpdateNotificationProviderDto
> {
  constructor(
    private readonly notificationProviderService: NotificationProviderService,
  ) {
    super(notificationProviderService);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Obtener proveedor por código' })
  @ApiParam({ name: 'code', example: 'TELEGRAM_OPS_PROVIDER' })
  @ApiOkResponse({ type: NotificationProviderResponseSchema })
  findByCode(@Param('code') code: string) {
    return this.notificationProviderService.findByCode(code);
  }

  @Get('notification-channel/:notificationChannelId')
  @ApiOperation({
    summary: 'Listar proveedores por canal de notificación',
  })
  @ApiParam({
    name: 'notificationChannelId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [NotificationProviderResponseSchema] })
  findByNotificationChannelId(
    @Param('notificationChannelId') notificationChannelId: string,
  ) {
    return this.notificationProviderService.findByNotificationChannelId(
      notificationChannelId,
    );
  }

  @Get('client-system/:clientSystemId')
  @ApiOperation({ summary: 'Listar proveedores por sistema cliente' })
  @ApiParam({
    name: 'clientSystemId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [NotificationProviderResponseSchema] })
  findByClientSystemId(@Param('clientSystemId') clientSystemId: string) {
    return this.notificationProviderService.findByClientSystemId(clientSystemId);
  }
}
