import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SWAGGER_DATE,
  SWAGGER_DATE_FUTURE,
  SWAGGER_UUID,
} from 'src/config/swagger/constants/swagger-examples';
import { BaseAuditSchema } from './base-audit.schema';

export class ClientSystemTokenResponseSchema extends BaseAuditSchema {
  @ApiProperty({ format: 'uuid', example: SWAGGER_UUID })
  id: string;

  @ApiProperty({
    example: 'a1b2c3d4e5f6...',
    description: 'Token de autenticación (valor enmascarado en listados)',
  })
  token: string;

  @ApiPropertyOptional({ example: 'Token API producción' })
  description?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE_FUTURE,
  })
  expiresAt?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE,
  })
  lastUsedAt?: string | null;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;
}
