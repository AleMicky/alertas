import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { ApiCrudDoc } from 'src/config/swagger/crud';
import { RoleCode } from 'src/domain/enums';
import { AlertService } from 'src/app/services/alert.service';
import { Roles } from 'src/infrastructure/security';
import { CreateAlertDto, ResponseAlertDto, UpdateAlertDto } from '../dto/alert';
import { AlertResponseSchema } from '../schemas';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR, RoleCode.VISUALIZADOR)
@Controller('alerts')
@ApiCrudDoc({
  tag: 'Alertas',
  createDto: CreateAlertDto,
  updateDto: UpdateAlertDto,
  responseDto: AlertResponseSchema,
})
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @ApiOperation({ summary: 'Listar alertas' })
  @ApiOkResponse({ type: [ResponseAlertDto] })
  findAll(): Promise<ResponseAlertDto[]> {
    return this.alertService.findAllMapped();
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Listar alertas por evento' })
  @ApiParam({
    name: 'eventId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [ResponseAlertDto] })
  findByEventId(@Param('eventId') eventId: string) {
    return this.alertService.findByEventIdMapped(eventId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar alertas por estado' })
  @ApiParam({ name: 'status', example: 'OPEN' })
  @ApiOkResponse({ type: [ResponseAlertDto] })
  findByStatus(@Param('status') status: string) {
    return this.alertService.findByStatusMapped(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener alerta por ID' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: ResponseAlertDto })
  findOne(@Param('id') id: string) {
    return this.alertService.findOneMapped(id);
  }
}
