import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
} from 'class-validator';
import {
  SWAGGER_DATE_ONLY,
} from 'src/config/swagger/constants/swagger-examples';

export class CreateClientSystemTokenDto {
  @ApiPropertyOptional({
    type: String,
    format: 'date',
    example: SWAGGER_DATE_ONLY,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  expiresAt: Date;
}
