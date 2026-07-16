import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { SystemNotificationsService } from 'src/app/services/system-notifications.service';
import { RoleCode } from 'src/domain/enums';
import { CurrentUser, Roles } from 'src/infrastructure/security';
import {
  ListSystemNotificationsQueryDto,
  SystemNotificationMarkAllReadResponseDto,
  SystemNotificationResponseDto,
  SystemNotificationUnreadCountResponseDto,
} from '../dto/system-notification';

@ApiTags('Notificaciones del sistema')
@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR, RoleCode.VISUALIZADOR)
@Controller('system-notifications')
export class SystemNotificationsController {
  constructor(
    private readonly systemNotificationsService: SystemNotificationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones in-app del usuario' })
  @ApiOkResponse({ type: [SystemNotificationResponseDto] })
  findMine(
    @CurrentUser('id') userId: string,
    @Query() query: ListSystemNotificationsQueryDto,
  ) {
    return this.systemNotificationsService.findForUser(userId, {
      limit: query.limit,
      unreadOnly: query.unreadOnly,
    });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contar notificaciones no leídas' })
  @ApiOkResponse({ type: SystemNotificationUnreadCountResponseDto })
  async unreadCount(@CurrentUser('id') userId: string) {
    const count =
      await this.systemNotificationsService.countUnreadForUser(userId);

    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: SystemNotificationResponseDto })
  markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.systemNotificationsService.markAsRead(id, userId);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiOkResponse({ type: SystemNotificationMarkAllReadResponseDto })
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.systemNotificationsService.markAllAsRead(userId);
  }
}
