import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NotificationCallbacksService } from 'src/app/services/notification-callbacks.service';
import { Public } from 'src/infrastructure/security';
import {
  N8nDeliveryCallbackDto,
  NotificationRequestDetailResponseDto,
} from '../dto/notification-request';

@ApiTags('Callbacks de notificación')
@Controller('notification-callbacks')
export class NotificationCallbacksController {
  constructor(
    private readonly notificationCallbacksService: NotificationCallbacksService,
  ) {}

  @Public()
  @Post('n8n/delivery')
  @ApiOperation({ summary: 'Registrar callback de entrega desde n8n' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  handleN8nDeliveryCallback(@Body() dto: N8nDeliveryCallbackDto) {
    return this.notificationCallbacksService.handleDeliveryCallback(dto);
  }
}
