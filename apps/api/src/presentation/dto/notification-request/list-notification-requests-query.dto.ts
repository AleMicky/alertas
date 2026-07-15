import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import {
  NotificationPriority,
  NotificationRequestStatus,
} from 'src/domain/enums';

export class ListNotificationRequestsQueryDto {
  @ApiPropertyOptional({ enum: NotificationRequestStatus })
  @IsOptional()
  @IsEnum(NotificationRequestStatus)
  status?: NotificationRequestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  clientSystemId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  notificationChannelId?: string;

  @ApiPropertyOptional({ example: 'TELEGRAM' })
  @IsOptional()
  @IsString()
  channelCode?: string;

  @ApiPropertyOptional({ enum: NotificationPriority })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correlationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  requestedFrom?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  requestedTo?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  includeArchived?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;
}
