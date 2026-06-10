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

export class CreateNotificationProviderDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: SWAGGER_UUID,
    description: 'Sistema cliente al que pertenece el proveedor',
  })
  @IsUUID()
  clientSystemId: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    example: SWAGGER_UUID_2,
    description: 'Canal de notificación asociado al proveedor',
  })
  @IsUUID()
  notificationChannelId: string;

  @ApiProperty({ type: String, example: 'TELEGRAM_OPS_PROVIDER' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, example: 'Proveedor Telegram Operaciones' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: Boolean, example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
