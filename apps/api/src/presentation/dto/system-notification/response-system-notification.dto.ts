import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SystemNotificationType } from 'src/domain/enums';
import { SWAGGER_DATE } from 'src/config/swagger/constants/swagger-examples';

export class SystemNotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SystemNotificationType })
  type: SystemNotificationType;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  body: string | null;

  @ApiPropertyOptional({ nullable: true })
  href: string | null;

  @ApiPropertyOptional({ nullable: true })
  notificationRequestId: string | null;

  @ApiPropertyOptional({ type: Object, nullable: true })
  metadata: Record<string, unknown> | null;

  @ApiProperty({ type: String, format: 'date-time', example: SWAGGER_DATE })
  createdAt: Date;

  @ApiProperty()
  read: boolean;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
    example: SWAGGER_DATE,
  })
  readAt: Date | null;
}

export class SystemNotificationUnreadCountResponseDto {
  @ApiProperty()
  count: number;
}

export class SystemNotificationMarkAllReadResponseDto {
  @ApiProperty()
  marked: number;
}
