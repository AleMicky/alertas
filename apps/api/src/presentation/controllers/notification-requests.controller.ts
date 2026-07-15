import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { NotificationRequestsService } from 'src/app/services/notification-requests.service';
import { ClientSystem } from 'src/domain/entities/client-system';
import { RoleCode } from 'src/domain/enums';
import { Public, Roles } from 'src/infrastructure/security';
import { CurrentClientSystem } from 'src/shared/decorators/current-client-system.decorator';
import { ClientSystemAuthGuard } from 'src/shared/guards/client-system-auth.guard';
import {
  ArchiveNotificationRequestsDto,
  ChangeNotificationRequestStatusDto,
  CreateNotificationRequestDto,
  ListNotificationRequestsQueryDto,
  NotificationRequestDetailResponseDto,
  NotificationRequestResponseDto,
  NotificationRequestSearchResponseDto,
  NotificationRequestStatsQueryDto,
  NotificationRequestStatsResponseDto,
  ScheduleNotificationRequestDto,
  UpdateNotificationRequestDto,
  UpdateNotificationRequestMetadataDto,
} from '../dto/notification-request';

@ApiTags('Solicitudes de notificación')
@Controller('notification-requests')
export class NotificationRequestsController {
  constructor(
    private readonly notificationRequestsService: NotificationRequestsService,
  ) {}

  @Public()
  @UseGuards(ClientSystemAuthGuard)
  @ApiBearerAuth('client-system-token')
  @Post()
  @ApiOperation({ summary: 'Enviar solicitud de notificación' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  submit(
    @CurrentClientSystem() clientSystem: ClientSystem,
    @Body() dto: CreateNotificationRequestDto,
  ) {
    return this.notificationRequestsService.submit(clientSystem.id, dto);
  }

  @Public()
  @UseGuards(ClientSystemAuthGuard)
  @ApiBearerAuth('client-system-token')
  @Get('me')
  @ApiOperation({ summary: 'Listar solicitudes del sistema cliente autenticado' })
  @ApiOkResponse({ type: [NotificationRequestResponseDto] })
  findMine(@CurrentClientSystem() clientSystem: ClientSystem) {
    return this.notificationRequestsService.findAllByClientSystemId(
      clientSystem.id,
    );
  }

  @Public()
  @UseGuards(ClientSystemAuthGuard)
  @ApiBearerAuth('client-system-token')
  @Get('me/:id')
  @ApiOperation({ summary: 'Consultar estado de una solicitud propia' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  findMineById(
    @CurrentClientSystem() clientSystem: ClientSystem,
    @Param('id') id: string,
  ) {
    return this.notificationRequestsService.getDetail(id).then((detail) => {
      if (detail.request.clientSystemId !== clientSystem.id) {
        throw new NotFoundException('Solicitud de notificación no encontrada');
      }

      return detail;
    });
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Get()
  @ApiOperation({ summary: 'Listar solicitudes de notificación (paginado)' })
  @ApiOkResponse({ type: NotificationRequestSearchResponseDto })
  findAll(@Query() query: ListNotificationRequestsQueryDto) {
    return this.notificationRequestsService.search(query);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de solicitudes' })
  @ApiOkResponse({ type: NotificationRequestStatsResponseDto })
  getStats(@Query() query: NotificationRequestStatsQueryDto) {
    return this.notificationRequestsService.getStats(query);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Get('search')
  @ApiOperation({ summary: 'Buscar solicitudes con filtros y paginación' })
  @ApiOkResponse({ type: NotificationRequestSearchResponseDto })
  search(@Query() query: ListNotificationRequestsQueryDto) {
    return this.notificationRequestsService.search(query);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Post('archive')
  @ApiOperation({ summary: 'Archivar solicitudes antiguas completadas' })
  archive(@Body() dto: ArchiveNotificationRequestsDto) {
    return this.notificationRequestsService.archive(dto);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle completo de solicitud' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  findOne(@Param('id') id: string) {
    return this.notificationRequestsService.getDetail(id);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar solicitud editable' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateNotificationRequestDto) {
    return this.notificationRequestsService.updateRequest(id, dto);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Patch(':id/metadata')
  @ApiOperation({ summary: 'Actualizar metadata de la solicitud' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  updateMetadata(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationRequestMetadataDto,
  ) {
    return this.notificationRequestsService.updateMetadata(id, dto.metadata);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado con validación de transición' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeNotificationRequestStatusDto,
  ) {
    return this.notificationRequestsService.changeStatus(id, dto);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Patch(':id/schedule')
  @ApiOperation({ summary: 'Programar envío de la solicitud' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  schedule(@Param('id') id: string, @Body() dto: ScheduleNotificationRequestDto) {
    return this.notificationRequestsService.schedule(id, dto);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Patch(':id/requeue')
  @ApiOperation({ summary: 'Reencolar solicitud' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  requeue(@Param('id') id: string) {
    return this.notificationRequestsService.requeue(id);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Patch(':id/retry-failed')
  @ApiOperation({ summary: 'Reintentar deliveries fallidos' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  retryFailed(@Param('id') id: string) {
    return this.notificationRequestsService.retryFailedDeliveries(id);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Patch(':id/recalculate-status')
  @ApiOperation({ summary: 'Recalcular estado según deliveries' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  recalculateStatus(@Param('id') id: string) {
    return this.notificationRequestsService.recalculateStatusFromDeliveries(id);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar solicitud pendiente' })
  @ApiOkResponse({ type: NotificationRequestDetailResponseDto })
  cancel(@Param('id') id: string) {
    return this.notificationRequestsService.cancel(id);
  }

  @ApiBearerAuth('jwt')
  @Roles(RoleCode.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitud archivada' })
  delete(@Param('id') id: string) {
    return this.notificationRequestsService.deleteRequest(id);
  }
}
