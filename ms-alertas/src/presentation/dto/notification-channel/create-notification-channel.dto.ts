import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
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

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  webhookToken?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Canal para el equipo de operaciones',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: Object,
    example: {
      title: 'string',
      message: 'string',
    },
  })
  @IsOptional()
  @IsObject()
  payloadSchemaJson?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: Object,
    example: {
      title: 'string',
      message: 'string',
    },
  })
  @IsOptional()
  @IsObject()
  payloadBodyJson?: Record<string, unknown>;
}
