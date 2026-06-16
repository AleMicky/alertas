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

  @ApiProperty({
    example: 'SOL-001',
    description: 'Referencia externa del evento',
    required: false,
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsObject()
  payloadJson?: Record<string, unknown>;
}
