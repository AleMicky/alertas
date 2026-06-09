import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SWAGGER_DATE } from 'src/config/swagger/constants/swagger-examples';

export class BaseAuditSchema {
  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'admin',
    description: 'Usuario que creó el registro',
  })
  createdBy?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
    example: SWAGGER_DATE,
    description: 'Fecha de creación',
  })
  createdAt?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'admin',
    description: 'Usuario que actualizó el registro',
  })
  updatedBy?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
    example: SWAGGER_DATE,
    description: 'Fecha de última actualización',
  })
  updatedAt?: string | null;
}
