import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { NotificationChannelType } from 'src/domain/enums/notification-channel-type.enum';

export class CreateNotificationChannelDto {
  @ApiProperty({ type: String, example: 'TELEGRAM_OPS' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, example: 'Telegram Operaciones' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: NotificationChannelType,
    example: NotificationChannelType.TELEGRAM,
    description: 'Tipo de canal de notificación',
  })
  @IsEnum(NotificationChannelType)
  type: NotificationChannelType;

  @ApiProperty({
    type: String,
    format: 'uri',
    example: 'https://n8n.ejemplo.com/webhook/telegram-ops',
  })
  @IsUrl()
  webhookUrl: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Canal para el equipo de operaciones',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: Boolean, example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
