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

export class CreateAlertRuleDto {
  @ApiProperty({ type: String, example: 'RULE_PAGO_RECHAZADO' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, example: 'Regla pago rechazado' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: 'PAYMENT_REJECTED',
    description: 'Tipo de evento que dispara la regla',
  })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({ type: String, format: 'uuid', example: SWAGGER_UUID })
  @IsUUID()
  severityLevelId: string;

  @ApiProperty({ type: String, format: 'uuid', example: SWAGGER_UUID_2 })
  @IsUUID()
  notificationChannelId: string;

  @ApiProperty({
    type: String,
    example: 'Alerta: {{title}}',
    description: 'Plantilla del título (soporta variables)',
  })
  @IsString()
  @IsNotEmpty()
  titleTemplate: string;

  @ApiProperty({
    type: String,
    example: 'Detalle: {{message}}',
    description: 'Plantilla del mensaje',
  })
  @IsString()
  @IsNotEmpty()
  messageTemplate: string;

  @ApiPropertyOptional({ type: Boolean, example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
