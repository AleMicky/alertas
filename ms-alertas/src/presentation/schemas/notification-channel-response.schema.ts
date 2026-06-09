import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SWAGGER_UUID } from 'src/config/swagger/constants/swagger-examples';
import { NotificationChannelType } from 'src/domain/enums/notification-channel-type.enum';
import { BaseAuditSchema } from './base-audit.schema';

export class NotificationChannelResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({ example: 'TELEGRAM_OPS' })
  code: string;

  @ApiProperty({ example: 'Telegram Operaciones' })
  name: string;

  @ApiProperty({
    enum: NotificationChannelType,
    example: NotificationChannelType.TELEGRAM,
  })
  type: NotificationChannelType;

  @ApiProperty({
    example: 'https://n8n.ejemplo.com/webhook/telegram-ops',
    format: 'uri',
  })
  webhookUrl: string;

  @ApiPropertyOptional({ example: 'Canal para alertas de operaciones' })
  description?: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
