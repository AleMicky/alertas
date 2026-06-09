import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { AlertRule } from 'src/domain/entities/alert-rule';
import { AlertRuleService } from 'src/app/services/alert-rule.service';
import { CreateAlertRuleDto, UpdateAlertRuleDto } from '../dto/alert-rule';
import { AlertRuleResponseSchema } from '../schemas';

@Controller('alert-rules')
@ApiCrudDoc({
  tag: 'Reglas de alerta',
  createDto: CreateAlertRuleDto,
  updateDto: UpdateAlertRuleDto,
  responseDto: AlertRuleResponseSchema,
})
export class AlertRuleController extends BaseController<
  AlertRule,
  CreateAlertRuleDto,
  UpdateAlertRuleDto
> {
  constructor(private readonly alertRuleService: AlertRuleService) {
    super(alertRuleService);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Obtener regla de alerta por código' })
  @ApiParam({ name: 'code', example: 'RULE_PAGO_RECHAZADO' })
  @ApiOkResponse({ type: AlertRuleResponseSchema })
  findByCode(@Param('code') code: string) {
    return this.alertRuleService.findByCode(code);
  }

  @Get('event-type/:eventType')
  @ApiOperation({ summary: 'Listar reglas por tipo de evento' })
  @ApiParam({ name: 'eventType', example: 'PAYMENT_REJECTED' })
  @ApiOkResponse({ type: [AlertRuleResponseSchema] })
  findByEventType(@Param('eventType') eventType: string) {
    return this.alertRuleService.findByEventType(eventType);
  }
}
