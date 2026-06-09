import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SWAGGER_DATE,
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';

export class AlertResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  eventId: string;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  alertRuleId: string;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  severityLevelId: string;

  @ApiProperty({ example: 'Pago rechazado - orden ORD-99' })
  title: string;

  @ApiProperty({ example: 'Revisar con el equipo de tesorería' })
  message: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'Estado: OPEN, IN_PROGRESS, CLOSED, etc.',
  })
  status: string;

  @ApiProperty({ type: String, format: 'date-time', example: SWAGGER_DATE })
  alertDate: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE,
  })
  attendedAt?: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
