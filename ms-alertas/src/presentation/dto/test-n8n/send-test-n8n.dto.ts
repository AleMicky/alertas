import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { NotificationChannelType } from 'src/domain/enums/notification-channel-type.enum';

export class SendTestN8nDto {
  @ApiPropertyOptional({
    example: 'test-1716860000000',
    description: 'Identificador de la notificación para pruebas',
  })
  @IsOptional()
  @IsString()
  notificationId?: string;

  @ApiPropertyOptional({
    enum: NotificationChannelType,
    example: NotificationChannelType.TELEGRAM,
    description: 'Canal de notificación a usar en la prueba',
  })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({
    example: '@mi_usuario',
    description: 'Destino del canal (chat, correo, webhook, etc.)',
  })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiPropertyOptional({
    example: 'Prueba MS Alert',
    description: 'Título de la notificación de prueba',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Mensaje enviado desde NestJS hacia n8n',
    description: 'Cuerpo del mensaje',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    example: 'HIGH',
    description: 'Severidad reportada (HIGH, MEDIUM, LOW)',
  })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({
    example: 'MS_ALERTAS',
    description: 'Código del sistema origen',
  })
  @IsOptional()
  @IsString()
  system?: string;

  @ApiPropertyOptional({
    example: 'TEST_EVENT',
    description: 'Tipo de evento de prueba',
  })
  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    example: { demo: true, source: 'swagger' },
    description: 'Datos adicionales enviados al webhook',
  })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
