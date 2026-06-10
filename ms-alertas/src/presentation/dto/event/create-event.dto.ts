import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { EventPayloadDto } from './event-recipient.dto';

export class CreateEventDto {

  @ApiProperty({
    example: 'VEHICLE_REQUEST_APPROVED',
    description: 'Código del tipo de evento',
  })
  @IsString()
  @IsNotEmpty()
  eventTypeCode: string;

  @ApiPropertyOptional({
    type: EventPayloadDto,
    description:
      'Metadatos del evento y destinatarios dinámicos por canal (EMAIL, TELEGRAM, TEAMS, etc.).',
    example: {
      recipients: [
        {
          channel: 'EMAIL',
          to: ['miguel.mamani.pxp@gmail.com'],
          cc: [],
          bcc: [],
          subject: 'Solicitud de Vacaciones',
          message: 'Debe aprobar la solicitud VAC-001',
          html: '<b>Debe aprobar la solicitud VAC-001</b>',
          attachments: [],
        },
        {
          channel: 'TELEGRAM',
          chatId: '123456789',
          message: 'Debe aprobar la solicitud VAC-001',
        },
      ],
    },
  })
  @IsOptional()
  @IsObject()
  payloadJson?: Record<string, unknown>;
}
