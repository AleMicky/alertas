import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class TestNotificationChannelProviderDto {
  @ApiPropertyOptional({
    example: 'test-target',
    description: 'Destino de prueba para el payload enviado al webhook',
  })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiPropertyOptional({
    example: 'Prueba proveedor',
    description: 'Título de la notificación de prueba',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Mensaje enviado desde el dashboard hacia el webhook del proveedor',
    description: 'Cuerpo del mensaje de prueba',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    example: { demo: true },
    description: 'Datos adicionales enviados al webhook',
  })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
