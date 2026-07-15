import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

import { ProviderAuthType } from 'src/domain/enums';

export class CreateNotificationChannelProviderDto {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del canal de notificación',
  })
  @IsUUID()
  @IsNotEmpty()
  notificationChannelId: string;

  @ApiProperty({ type: String, example: 'TELEGRAM_DEFAULT' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, example: 'Telegram principal' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: 'https://n8n.example.com/webhook/telegram',
  })
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  webhookUrl: string;

  @ApiProperty({
    enum: ProviderAuthType,
    example: ProviderAuthType.NONE,
  })
  @IsEnum(ProviderAuthType)
  authType: ProviderAuthType;

  @ApiPropertyOptional({
    type: Object,
    example: { apiKey: 'secret' },
  })
  @IsOptional()
  @IsObject()
  authConfig?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: Object,
    example: { 'X-Custom-Header': 'value' },
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, unknown>;

  @ApiPropertyOptional({ type: Number, example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeoutSeconds?: number;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  retryEnabled?: boolean;

  @ApiPropertyOptional({ type: Number, example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;
}
