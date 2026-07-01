import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ValidateNotificationPayloadSchemaDto {
  @ApiProperty({
    type: Object,
    example: {
      to: ['usuario@empresa.com'],
      subject: 'Solicitud aprobada',
      message: 'Su solicitud fue aprobada',
    },
  })
  @IsObject()
  payload: Record<string, unknown>;
}
