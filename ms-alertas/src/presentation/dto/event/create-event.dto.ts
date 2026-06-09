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
  @ApiPropertyOptional({
    example: 'GESTION_VEHICULAR',
    description:
      'Opcional. Si se envía, debe coincidir con el sistema del token Bearer.',
  })
  @IsOptional()
  @IsString()
  clientSystemCode?: string;

  @ApiProperty({
    example: 'VEHICLE_REQUEST_APPROVED',
    description: 'Código del tipo de evento',
  })
  @IsString()
  @IsNotEmpty()
  eventTypeCode: string;

  @ApiPropertyOptional({
    example: 'Solicitud aprobada',
    description:
      'Opcional. Si no se envía, se usa el subject del primer recipient o el nombre del tipo de evento.',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'La solicitud SOL-001 fue aprobada.',
    description:
      'Opcional. Si no se envía, se usa el message del primer recipient o la descripción del tipo de evento.',
  })
  @IsOptional()
  @IsString()
  message?: string;

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

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
