import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

import { NotificationRequestStatus } from 'src/domain/enums';

export class ChangeNotificationRequestStatusDto {
  @ApiProperty({ enum: NotificationRequestStatus })
  @IsEnum(NotificationRequestStatus)
  status: NotificationRequestStatus;

  @ApiPropertyOptional({ example: 'Revisión manual' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ScheduleNotificationRequestDto {
  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  scheduledAt: string;
}

export class ArchiveNotificationRequestsDto {
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  olderThan: string;
}

export class UpdateNotificationRequestMetadataDto {
  @ApiProperty({ type: Object })
  @IsObject()
  metadata: Record<string, unknown>;
}

export class N8nDeliveryCallbackDto {
  @ApiProperty()
  @IsString()
  deliveryId: string;

  @ApiProperty({ example: 'DELIVERED' })
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerMessageId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
