import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';

export class AlertRuleResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({ example: 'RULE_PAGO_RECHAZADO' })
  code: string;

  @ApiProperty({ example: 'Regla pago rechazado' })
  name: string;

  @ApiProperty({ example: 'PAYMENT_REJECTED' })
  eventType: string;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  severityLevelId: string;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  notificationChannelId: string;

  @ApiProperty({ example: 'Alerta: {{title}}' })
  titleTemplate: string;

  @ApiProperty({ example: 'Se detectó: {{message}}' })
  messageTemplate: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
