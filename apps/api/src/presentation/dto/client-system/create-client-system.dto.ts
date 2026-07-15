import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientSystemDto {
  @ApiProperty({
    type: String,
    example: 'SIS_FIN',
    description: 'Código único del sistema cliente',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: String,
    example: 'Sistema Financiero',
    description: 'Nombre descriptivo del sistema',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Integración con el core bancario',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
