import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

 
export class CreateEventDto {

  @ApiProperty({
    example: 'VEHICLE_REQUEST_APPROVED',
    description: 'Código del tipo de evento',
  })
  @IsString()
  @IsNotEmpty()
  eventTypeCode: string;

   
  @IsOptional()
  @IsObject()
  payloadJson?: Record<string, unknown>;
}
