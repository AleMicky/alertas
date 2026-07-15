import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationChannelDto {
  @ApiProperty({ type: String, example: 'TELEGRAM_OPS' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String, example: 'Telegram Operaciones' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
