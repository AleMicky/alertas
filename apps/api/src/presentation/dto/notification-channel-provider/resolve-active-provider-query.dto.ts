import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ResolveActiveProviderQueryDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del canal de notificación',
  })
  @IsOptional()
  @IsUUID()
  notificationChannelId?: string;

  @ApiPropertyOptional({
    example: 'TELEGRAM',
    description: 'Código del canal de notificación',
  })
  @IsOptional()
  @IsString()
  channelCode?: string;

  @ApiPropertyOptional({
    example: 'TELEGRAM_DEFAULT',
    description: 'Código del proveedor a resolver dentro del canal',
  })
  @IsOptional()
  @IsString()
  providerCode?: string;
}
