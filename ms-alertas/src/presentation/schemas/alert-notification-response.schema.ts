import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SWAGGER_DATE,
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';

export class AlertNotificationResponseSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  alertId: string;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  notificationChannelId: string;

  @ApiProperty({ example: 'SENT' })
  status: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE,
  })
  sentAt?: string;

  @ApiPropertyOptional({ example: '{"ok":true,"messageId":"tg-123"}' })
  response?: string;
}
