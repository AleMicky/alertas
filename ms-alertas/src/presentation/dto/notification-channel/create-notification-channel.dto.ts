import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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
}
