import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { NotificationPayloadSchemasService } from 'src/app/services/notification-payload-schemas.service';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { NotificationPayloadSchema } from 'src/domain/entities/notification-payload-schema';
import { RoleCode } from 'src/domain/enums';
import { Roles } from 'src/infrastructure/security';
import { BaseController } from 'src/shared/core/base.controller';
import {
  CreateNotificationPayloadSchemaDto,
  NotificationPayloadSchemaResponseDto,
  PayloadSchemaValidationResultDto,
  UpdateNotificationPayloadSchemaDto,
  ValidateNotificationPayloadSchemaDto,
} from '../dto/notification-payload-schema';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
@Controller('payload-schemas')
@ApiCrudDoc({
  tag: 'Schemas de payload de notificación',
  createDto: CreateNotificationPayloadSchemaDto,
  updateDto: UpdateNotificationPayloadSchemaDto,
  responseDto: NotificationPayloadSchemaResponseDto,
})
export class NotificationPayloadSchemasController extends BaseController<
  NotificationPayloadSchema,
  CreateNotificationPayloadSchemaDto,
  UpdateNotificationPayloadSchemaDto
> {
  constructor(
    private readonly notificationPayloadSchemasService: NotificationPayloadSchemasService,
  ) {
    super(notificationPayloadSchemasService);
  }

  @Get('active/:channelCode')
  @ApiOperation({ summary: 'Obtener schema activo por código de canal' })
  @ApiParam({ name: 'channelCode', example: 'EMAIL' })
  @ApiOkResponse({ type: NotificationPayloadSchemaResponseDto })
  async findActiveByChannelCode(@Param('channelCode') channelCode: string) {
    const schema =
      await this.notificationPayloadSchemasService.findActiveByChannelCode(
        channelCode,
      );

    if (!schema) {
      throw new NotFoundException(
        'No hay un schema activo para este canal de notificación',
      );
    }

    return schema;
  }

  @Post('active/:channelCode/validate')
  @ApiOperation({
    summary: 'Validar payload contra el schema activo del canal',
  })
  @ApiParam({ name: 'channelCode', example: 'EMAIL' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        channelCode: { type: 'string' },
        schemaId: { type: 'string' },
        schemaVersion: { type: 'number' },
        valid: { type: 'boolean' },
        errors: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  validatePayloadAgainstActiveChannel(
    @Param('channelCode') channelCode: string,
    @Body() body: ValidateNotificationPayloadSchemaDto,
  ) {
    return this.notificationPayloadSchemasService.validatePayloadAgainstActiveChannel(
      channelCode,
      body.payload,
    );
  }

  @Get('by-channel/:notificationChannelId')
  @ApiOperation({ summary: 'Listar schemas por canal de notificación' })
  @ApiParam({
    name: 'notificationChannelId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [NotificationPayloadSchemaResponseDto] })
  findByNotificationChannelId(
    @Param('notificationChannelId') notificationChannelId: string,
  ) {
    return this.notificationPayloadSchemasService.findAllByNotificationChannelId(
      notificationChannelId,
    );
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validar payload contra un schema específico' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: PayloadSchemaValidationResultDto })
  validatePayload(
    @Param('id') id: string,
    @Body() body: ValidateNotificationPayloadSchemaDto,
  ) {
    return this.notificationPayloadSchemasService.validatePayloadById(
      id,
      body.payload,
    );
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary:
      'Activar schema y desactivar los demás del mismo canal de notificación',
  })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: NotificationPayloadSchemaResponseDto })
  activate(@Param('id') id: string) {
    return this.notificationPayloadSchemasService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar schema de payload' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: NotificationPayloadSchemaResponseDto })
  deactivate(@Param('id') id: string) {
    return this.notificationPayloadSchemasService.deactivate(id);
  }
}
