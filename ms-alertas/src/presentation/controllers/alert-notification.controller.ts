import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
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
import { Roles } from 'src/infrastructure/security';
import { AlertNotificationResponseSchema } from '../schemas';
import {
  CreateAlertNotificationDto,
  UpdateAlertNotificationDto,
} from '../dto/alert-notification';

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
   // private readonly alertNotificationService: AlertNotificationService,
  ) {
   // super(alertNotificationService);
   }

  /*@Get('alert/:alertId')
  @ApiOperation({ summary: 'Listar notificaciones por alerta' })
  @ApiParam({
    name: 'alertId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [AlertNotificationResponseSchema] })
  findByAlertId(@Param('alertId') alertId: string) {
    return this.alertNotificationService.findByAlertId(alertId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar notificaciones por estado' })
  @ApiParam({
    name: 'status',
    enum: AlertNotificationStatus,
    example: AlertNotificationStatus.SENT,
  })
  @ApiOkResponse({ type: [AlertNotificationResponseSchema] })
  findByStatus(
    @Param('status', new ParseEnumPipe(AlertNotificationStatus))
    status: AlertNotificationStatus,
  ) {
    return this.alertNotificationService.findByStatus(status);
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
  }*/
}
