import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  SWAGGER_DATE,
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';

export class CreateAlertDto {
  @ApiProperty({ type: String, format: 'uuid', example: SWAGGER_UUID })
  @IsUUID()
  eventId: string;

  @ApiProperty({ type: String, format: 'uuid', example: SWAGGER_UUID_2 })
  @IsUUID()
  alertRuleId: string;

  @ApiProperty({ type: String, format: 'uuid', example: SWAGGER_UUID_2 })
  @IsUUID()
  severityLevelId: string;

  @ApiProperty({ type: String, example: 'Pago rechazado - orden ORD-99' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Revisar con tesorería antes del cierre',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    type: String,
    example: 'OPEN',
    description: 'Estado inicial de la alerta',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE,
    description: 'Fecha de la alerta (ISO 8601)',
  })
  @IsDateString()
  alertDate: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE,
    description: 'Fecha en que fue atendida',
  })
  @IsOptional()
  @IsDateString()
  attendedAt?: string;

  @ApiPropertyOptional({ type: Boolean, example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
