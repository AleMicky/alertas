import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { ClientSystem } from 'src/domain/entities/client-system';
import { Event } from 'src/domain/entities/event';
import { EventService } from 'src/app/services/event.service';
import { CurrentClientSystem } from 'src/shared/decorators/current-client-system.decorator';
import { Public } from 'src/infrastructure/auth/public.decorator';
import { ClientSystemAuthGuard } from 'src/shared/guards/client-system-auth.guard';
import { CreateEventDto, UpdateEventDto } from '../dto/event';
import { EventResponseSchema } from '../schemas';

@Controller('events')
@ApiCrudDoc({
  tag: 'Eventos',
  createDto: CreateEventDto,
  updateDto: UpdateEventDto,
  responseDto: EventResponseSchema,
})
export class EventController extends BaseController<
  Event,
  CreateEventDto,
  UpdateEventDto
> {
  constructor(private readonly eventService: EventService) {
    super(eventService);
  }

  @Post()
  @Public()
  @UseGuards(ClientSystemAuthGuard)
  @ApiBearerAuth('client-system-token')
  @ApiBody({ type: CreateEventDto })
  create(
    @Body() dto: CreateEventDto,
    @CurrentClientSystem() clientSystem?: ClientSystem,
  ) {
    return this.eventService.createFromDto(dto, clientSystem!);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Obtener evento por código' })
  @ApiParam({ name: 'code', example: 'EVT_PAGO_RECHAZADO' })
  @ApiOkResponse({ type: EventResponseSchema })
  findByCode(@Param('code') code: string) {
    return this.eventService.findByCode(code);
  }

  @Get('client-system/:clientSystemId')
  @ApiOperation({ summary: 'Listar eventos por sistema cliente' })
  @ApiParam({
    name: 'clientSystemId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [EventResponseSchema] })
  findByClientSystemId(@Param('clientSystemId') clientSystemId: string) {
    return this.eventService.findByClientSystemId(clientSystemId);
  }
}
