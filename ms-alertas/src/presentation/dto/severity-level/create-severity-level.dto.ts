import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSeverityLevelDto {
  @ApiProperty({ type: String, example: 'HIGH', description: 'Código único' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, example: 'Alta', description: 'Nombre legible' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Requiere atención en menos de 15 minutos',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Prioridad numérica (mayor = más urgente)',
  })
  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @ApiPropertyOptional({
    type: Number,
    example: 15,
    description: 'Tiempo máximo de atención en minutos',
  })
  @IsOptional()
  @IsNumber()
  attentionTimeMinutes?: number;

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
