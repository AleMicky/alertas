import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  SWAGGER_DATE_FUTURE,
  SWAGGER_UUID,
} from 'src/config/swagger/constants/swagger-examples';

export class CreateClientSystemTokenDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: SWAGGER_UUID,
    description: 'ID del sistema cliente al que pertenece el token',
  })
  @IsUUID()
  @IsNotEmpty()
  clientSystemId: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 300,
    example: 'Token API producción',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: SWAGGER_DATE_FUTURE,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ type: Boolean, example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
