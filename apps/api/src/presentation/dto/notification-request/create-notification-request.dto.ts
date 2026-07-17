import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { NotificationPriority } from 'src/domain/enums';

export class CreateNotificationAttachmentDto {
  @ApiProperty({ example: 'comprobante.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'https://storage.example.com/comprobante.pdf' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ example: 102400 })
  @IsInt()
  @Min(1)
  sizeBytes: number;

  @ApiPropertyOptional({ example: 'sha256:abc123' })
  @IsOptional()
  @IsString()
  checksum?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  sortOrder?: number;
}

export class CreateNotificationRequestDto {
  @ApiProperty({ example: 'GMAIL' })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiPropertyOptional({ type: [CreateNotificationAttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNotificationAttachmentDto)
  attachments?: CreateNotificationAttachmentDto[];

  @ApiPropertyOptional({ example: 'ORD-2026-0001' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalReference?: string;

  @ApiPropertyOptional({ example: 'corr-abc-123' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  correlationId?: string;

  @ApiPropertyOptional({ example: 'req-unique-key-001' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idempotencyKey?: string;

  @ApiPropertyOptional({ example: 'Solicitud aprobada' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional({ example: 'Su solicitud fue aprobada correctamente' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    type: Object,
    example: {
      to: ['usuario@empresa.com'],
      cc: [],
      bcc: [],
      subject: 'Prueba',
      message: 'Hola',
    },
  })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, unknown>;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
