import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  SWAGGER_UUID,
  SWAGGER_UUID_2,
} from 'src/config/swagger/constants/swagger-examples';

export class CreateEventTypeDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: SWAGGER_UUID,
    description: 'Sistema cliente al que pertenece el tipo de evento',
  })
  @IsUUID()
  clientSystemId: string;

  @ApiProperty({ type: String, example: 'PAYMENT_REJECTED' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, example: 'Pago rechazado' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Evento generado cuando un pago es rechazado por el banco',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: SWAGGER_UUID_2,
    description: 'Nivel de severidad por defecto del tipo de evento',
  })
  @IsOptional()
  @IsUUID()
  severityLevelId?: string;

  @ApiPropertyOptional({ type: Boolean, example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
