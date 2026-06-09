import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  SWAGGER_DATE,
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';

export class CreateAlertNotificationDto {
  @ApiProperty({ type: String, format: 'uuid', example: SWAGGER_UUID })
  @IsUUID()
  alertId: string;

  @ApiProperty({ type: String, format: 'uuid', example: SWAGGER_UUID_2 })
  @IsUUID()
  notificationChannelId: string;

  @ApiPropertyOptional({ type: String, example: 'PENDING' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE,
  })
  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @ApiPropertyOptional({
    type: String,
    example: '{"ok":true,"messageId":"tg-123"}',
    description: 'Respuesta del canal o webhook',
  })
  @IsOptional()
  @IsString()
  response?: string;
}
