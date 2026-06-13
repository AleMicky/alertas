import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { ApiCrudDoc } from 'src/config/swagger/crud';
import { ClientSystem } from 'src/domain/entities/client-system';
import { RoleCode } from 'src/domain/enums';
import { EventService } from 'src/app/services/event.service';
import { CurrentClientSystem } from 'src/shared/decorators/current-client-system.decorator';
import { ClientSystemAuthGuard } from 'src/shared/guards/client-system-auth.guard';
import { Public, Roles } from 'src/infrastructure/security';
import { CreateEventDto, UpdateEventDto } from '../dto/event';
import { ResponseEventDto } from '../dto/event/response-event.dto';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR, RoleCode.VISUALIZADOR)
@Controller('events')
@ApiCrudDoc({
  tag: 'Eventos',
  createDto: CreateEventDto,
  updateDto: UpdateEventDto,
  responseDto: ResponseEventDto,
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: 'Listar eventos' })
  @ApiOkResponse({ type: [ResponseEventDto] })
  findAll() {
    return this.eventService.findAllMapped();
  }

  @Get('client-system/:clientSystemId')
  @ApiOperation({ summary: 'Listar eventos por sistema cliente' })
  @ApiParam({
    name: 'clientSystemId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [ResponseEventDto] })
  findByClientSystemId(@Param('clientSystemId') clientSystemId: string) {
    return this.eventService.findByClientSystemId(clientSystemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento por ID' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: ResponseEventDto })
  findOne(@Param('id') id: string) {
    return this.eventService.findOneMapped(id);
  }

  @Public()
  @Post()
  @UseGuards(ClientSystemAuthGuard)
  @ApiBearerAuth('client-system-token')
  @ApiBody({ type: CreateEventDto })
  @ApiOkResponse({ type: ResponseEventDto })
  create(
    @Body() dto: CreateEventDto,
    @CurrentClientSystem() clientSystem?: ClientSystem,
  ) {
    return this.eventService.createFromDto(dto, clientSystem!);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evento' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateEventDto })
  @ApiOkResponse({ type: ResponseEventDto })
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.updateMapped(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evento' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  delete(@Param('id') id: string) {
    return this.eventService.delete(id);
  }
}
