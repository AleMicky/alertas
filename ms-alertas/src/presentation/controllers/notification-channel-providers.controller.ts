import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { NotificationChannelProvidersService } from 'src/app/services/notification-channel-providers.service';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { NotificationChannelProvider } from 'src/domain/entities/notification-channel-providers';
import { RoleCode } from 'src/domain/enums';
import { Roles } from 'src/infrastructure/security';
import { BaseController } from 'src/shared/core/base.controller';
import {
  CreateNotificationChannelProviderDto,
  NotificationChannelProviderResponseDto,
  ProviderValidationResultDto,
  ResolveActiveProviderQueryDto,
  TestNotificationChannelProviderDto,
  UpdateNotificationChannelProviderDto,
} from '../dto/notification-channel-provider';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
@Controller('notification-channel-providers')
@ApiCrudDoc({
  tag: 'Proveedores de canal de notificación',
  createDto: CreateNotificationChannelProviderDto,
  updateDto: UpdateNotificationChannelProviderDto,
  responseDto: NotificationChannelProviderResponseDto,
})
export class NotificationChannelProvidersController extends BaseController<
  NotificationChannelProvider,
  CreateNotificationChannelProviderDto,
  UpdateNotificationChannelProviderDto
> {
  constructor(
    private readonly notificationChannelProvidersService: NotificationChannelProvidersService,
  ) {
    super(notificationChannelProvidersService);
  }

  @Get('active/resolve')
  @ApiOperation({ summary: 'Resolver proveedor activo por canal o código' })
  @ApiOkResponse({ type: NotificationChannelProviderResponseDto })
  resolveActiveProvider(@Query() query: ResolveActiveProviderQueryDto) {
    return this.notificationChannelProvidersService.resolveActiveProvider(query);
  }

  @Get('by-channel/:notificationChannelId')
  @ApiOperation({ summary: 'Listar proveedores por canal de notificación' })
  @ApiParam({
    name: 'notificationChannelId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [NotificationChannelProviderResponseDto] })
  findByNotificationChannelId(
    @Param('notificationChannelId') notificationChannelId: string,
  ) {
    return this.notificationChannelProvidersService.findAllByNotificationChannelId(
      notificationChannelId,
    );
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validar configuración del proveedor' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: ProviderValidationResultDto })
  async validateConfiguration(@Param('id') id: string) {
    const provider = await this.notificationChannelProvidersService.findOne(id);

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return this.notificationChannelProvidersService.validateConfiguration(
      provider,
    );
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Probar webhook del proveedor' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Respuesta del webhook del proveedor',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  testNotificationChannelProvider(
    @Param('id') id: string,
    @Body() body: TestNotificationChannelProviderDto,
  ) {
    return this.notificationChannelProvidersService.testNotificationChannelProvider(
      id,
      body,
    );
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activar proveedor y desactivar los demás del mismo canal',
  })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: NotificationChannelProviderResponseDto })
  activate(@Param('id') id: string) {
    return this.notificationChannelProvidersService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar proveedor' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: NotificationChannelProviderResponseDto })
  deactivate(@Param('id') id: string) {
    return this.notificationChannelProvidersService.deactivate(id);
  }
}
