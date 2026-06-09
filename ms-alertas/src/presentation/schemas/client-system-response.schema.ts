import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SWAGGER_UUID } from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';
import { ClientSystemTokenResponseSchema } from './client-system-token-response.schema';

export class ClientSystemResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({ example: 'SIS_FIN', description: 'Código único del sistema' })
  code: string;

  @ApiProperty({
    example: 'Sistema Financiero',
    description: 'Nombre del sistema',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Integración con core bancario',
  })
  description?: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;

  @ApiPropertyOptional({
    type: [ClientSystemTokenResponseSchema],
    description: 'Tokens asociados (solo en endpoints con detalle)',
  })
  tokens?: ClientSystemTokenResponseSchema[];
}
