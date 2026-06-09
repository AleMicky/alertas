import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';

export class EventTypeResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({
    format: 'uuid',
    example: SWAGGER_UUID_2,
    description: 'ID del sistema cliente',
  })
  clientSystemId: string;

  @ApiProperty({ example: 'PAYMENT_REJECTED' })
  code: string;

  @ApiProperty({ example: 'Pago rechazado' })
  name: string;

  @ApiPropertyOptional({
    example: 'Evento generado cuando un pago es rechazado por el banco',
  })
  description?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    example: SWAGGER_UUID_2,
    description: 'Nivel de severidad por defecto',
  })
  severityLevelId?: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
