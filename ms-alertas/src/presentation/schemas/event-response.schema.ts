import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SWAGGER_DATE,
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';

export class EventResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({
    format: 'uuid',
    example: SWAGGER_UUID_2,
    description: 'ID del sistema cliente',
  })
  clientSystemId: string;

  @ApiProperty({ example: 'EVT_PAGO_RECHAZADO' })
  code: string;

  @ApiProperty({ example: 'PAYMENT_REJECTED' })
  eventType: string;

  @ApiProperty({ example: 'Pago rechazado' })
  title: string;

  @ApiProperty({
    example: 'El pago con referencia ABC123 fue rechazado por el banco',
  })
  message: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    example: { orderId: 'ORD-99', amount: 1500.5 },
  })
  payloadJson?: Record<string, unknown>;

  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID_2 })
  severityLevelId: string;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ type: String, format: 'date-time', example: SWAGGER_DATE })
  eventDate: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE,
  })
  processedAt?: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
