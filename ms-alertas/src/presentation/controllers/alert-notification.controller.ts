import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { ApiCrudDoc } from 'src/config/swagger/crud';
import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';
import { RoleCode } from 'src/domain/enums';
import { AlertNotificationService } from 'src/app/services/alert-notification.service';
import { Roles } from 'src/infrastructure/security';
import { AlertNotificationResponseSchema } from '../schemas';
import {
  CreateAlertNotificationDto,
  UpdateAlertNotificationDto,
} from '../dto/alert-notification';
import { ResponseAlertNotificationDto } from '../dto/alert-notification/response-alert-notification.dto';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR, RoleCode.VISUALIZADOR)
@Controller('alert-notifications')
@ApiCrudDoc({
  tag: 'Notificaciones',
  createDto: CreateAlertNotificationDto,
  updateDto: UpdateAlertNotificationDto,
  responseDto: AlertNotificationResponseSchema,
})
export class AlertNotificationController {
  constructor(
    private readonly alertNotificationService: AlertNotificationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones de alerta' })
  @ApiOkResponse({ type: [ResponseAlertNotificationDto] })
  findAll(): Promise<ResponseAlertNotificationDto[]> {
    return this.alertNotificationService.findAllMapped();
  }

  @Get('alert/:alertId')
  @ApiOperation({ summary: 'Listar notificaciones por alerta' })
  @ApiParam({
    name: 'alertId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [ResponseAlertNotificationDto] })
  findByAlertId(@Param('alertId') alertId: string) {
    return this.alertNotificationService.findByAlertIdMapped(alertId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar notificaciones por estado' })
  @ApiParam({
    name: 'status',
    enum: AlertNotificationStatus,
    example: AlertNotificationStatus.SENT,
  })
  @ApiOkResponse({ type: [ResponseAlertNotificationDto] })
  findByStatus(
    @Param('status', new ParseEnumPipe(AlertNotificationStatus))
    status: AlertNotificationStatus,
  ) {
    return this.alertNotificationService.findByStatusMapped(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener notificación por ID' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: ResponseAlertNotificationDto })
  async findOne(@Param('id') id: string) {
    const notification =
      await this.alertNotificationService.findOneMapped(id);

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return notification;
  }

  @Post()
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  create(): never {
    throw new MethodNotAllowedException(
      'Las notificaciones se crean automáticamente al registrar un evento',
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  update(): never {
    throw new MethodNotAllowedException(
      'Las notificaciones se actualizan mediante el procesador de cola',
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  replace(): never {
    throw new MethodNotAllowedException(
      'Las notificaciones se actualizan mediante el procesador de cola',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  delete(): never {
    throw new MethodNotAllowedException(
      'No se permite eliminar notificaciones por API',
    );
  }
}
