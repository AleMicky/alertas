import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { Alert } from 'src/domain/entities/alert';
import { AlertService } from 'src/app/services/alert.service';
import { CreateAlertDto, UpdateAlertDto } from '../dto/alert';
import { AlertResponseSchema } from '../schemas';

@Controller('alerts')
@ApiCrudDoc({
  tag: 'Alertas',
  createDto: CreateAlertDto,
  updateDto: UpdateAlertDto,
  responseDto: AlertResponseSchema,
})
export class AlertController extends BaseController<
  Alert,
  CreateAlertDto,
  UpdateAlertDto
> {
  constructor(private readonly alertService: AlertService) {
    super(alertService);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Listar alertas por evento' })
  @ApiParam({
    name: 'eventId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [AlertResponseSchema] })
  findByEventId(@Param('eventId') eventId: string) {
    return this.alertService.findByEventId(eventId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar alertas por estado' })
  @ApiParam({ name: 'status', example: 'OPEN' })
  @ApiOkResponse({ type: [AlertResponseSchema] })
  findByStatus(@Param('status') status: string) {
    return this.alertService.findByStatus(status);
  }
}
