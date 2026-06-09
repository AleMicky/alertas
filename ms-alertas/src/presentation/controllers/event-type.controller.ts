import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { EventType } from 'src/domain/entities/event-type';
import { EventTypeService } from 'src/app/services/event-type.service';
import { CreateEventTypeDto, UpdateEventTypeDto } from '../dto/event-type';
import { EventTypeResponseSchema } from '../schemas';

@Controller('event-types')
@ApiCrudDoc({
  tag: 'Tipos de evento',
  createDto: CreateEventTypeDto,
  updateDto: UpdateEventTypeDto,
  responseDto: EventTypeResponseSchema,
})
export class EventTypeController extends BaseController<
  EventType,
  CreateEventTypeDto,
  UpdateEventTypeDto
> {
  constructor(private readonly eventTypeService: EventTypeService) {
    super(eventTypeService);
  }

  @Get('code/:code/client-system/:clientSystemId')
  @ApiOperation({ summary: 'Obtener tipo de evento por código' })
  @ApiParam({ name: 'code', example: 'PAYMENT_REJECTED' })
  @ApiParam({
    name: 'clientSystemId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: EventTypeResponseSchema })
  findByCode(
    @Param('code') code: string,
    @Param('clientSystemId') clientSystemId: string,
  ) {
    return this.eventTypeService.findByCode(clientSystemId, code);
  }

  @Get('client-system/:clientSystemId/active')
  @ApiOperation({
    summary: 'Listar tipos de evento activos por sistema cliente',
  })
  @ApiParam({
    name: 'clientSystemId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [EventTypeResponseSchema] })
  findActiveByClientSystem(@Param('clientSystemId') clientSystemId: string) {
    return this.eventTypeService.findActiveByClientSystem(clientSystemId);
  }
}
