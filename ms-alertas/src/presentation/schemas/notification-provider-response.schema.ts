import { ApiProperty } from '@nestjs/swagger';
import {
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';

export class NotificationProviderResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({
    format: 'uuid',
    example: SWAGGER_UUID,
    description: 'ID del sistema cliente',
  })
  clientSystemId: string;

  @ApiProperty({
    format: 'uuid',
    example: SWAGGER_UUID_2,
    description: 'ID del canal de notificación',
  })
  notificationChannelId: string;

  @ApiProperty({ example: 'TELEGRAM_OPS_PROVIDER' })
  code: string;

  @ApiProperty({ example: 'Proveedor Telegram Operaciones' })
  name: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
