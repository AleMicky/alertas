import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  NotificationPriority,
  NotificationRequestStatus,
} from 'src/domain/enums';
import { SWAGGER_DATE } from 'src/config/swagger/constants/swagger-examples';

export class NotificationRequestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientSystemId: string;

  @ApiPropertyOptional({ nullable: true })
  notificationChannelId: string | null;

  @ApiPropertyOptional({ nullable: true })
  externalReference: string | null;

  @ApiPropertyOptional({ nullable: true })
  correlationId: string | null;

  @ApiPropertyOptional({ nullable: true })
  idempotencyKey: string | null;

  @ApiPropertyOptional({ nullable: true })
  title: string | null;

  @ApiPropertyOptional({ nullable: true })
  message: string | null;

  @ApiProperty({ type: Object })
  payload: Record<string, unknown>;

  @ApiPropertyOptional({ type: Object, nullable: true })
  metadata: Record<string, unknown> | null;

  @ApiProperty({ enum: NotificationRequestStatus })
  status: NotificationRequestStatus;

  @ApiProperty({ enum: NotificationPriority })
  priority: NotificationPriority;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  scheduledAt: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  expiresAt: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  archivedAt: Date | null;

  @ApiProperty({ type: String, format: 'date-time', example: SWAGGER_DATE })
  requestedAt: Date;

  @ApiProperty({ type: String, format: 'date-time', example: SWAGGER_DATE })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time', example: SWAGGER_DATE })
  updatedAt: Date;
}

export class NotificationRequestStatsResponseDto {
  @ApiProperty({ type: Array })
  byStatus: { key: string; count: number }[];

  @ApiProperty({ type: Array })
  byChannel: { key: string; count: number }[];

  @ApiProperty({ type: Array })
  byClientSystem: { key: string; count: number }[];

  @ApiProperty()
  total: number;
}

export class NotificationRequestDetailResponseDto {
  @ApiProperty({ type: NotificationRequestResponseDto })
  request: NotificationRequestResponseDto;

  @ApiProperty({ type: Array })
  recipients: unknown[];

  @ApiProperty({ type: Array })
  attachments: unknown[];

  @ApiProperty({ type: Array })
  deliveries: unknown[];

  @ApiProperty({ type: Array })
  audits: unknown[];

  @ApiProperty({ type: Array })
  attempts: unknown[];
}

export class NotificationRequestSearchResponseDto {
  @ApiProperty({ type: [NotificationRequestResponseDto] })
  items: NotificationRequestResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}
