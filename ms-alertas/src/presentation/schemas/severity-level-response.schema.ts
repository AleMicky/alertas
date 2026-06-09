import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SWAGGER_UUID } from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';

export class SeverityLevelResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({
    example: 'HIGH',
    description: 'Código del nivel de severidad',
  })
  code: string;

  @ApiProperty({ example: 'Alta', description: 'Nombre legible' })
  name: string;

  @ApiPropertyOptional({
    example: 'Alertas críticas que requieren atención inmediata',
  })
  description?: string;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Prioridad (mayor = más urgente)',
  })
  priority: number;

  @ApiPropertyOptional({
    type: Number,
    example: 15,
    description: 'Tiempo máximo de atención en minutos',
  })
  attentionTimeMinutes?: number;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
