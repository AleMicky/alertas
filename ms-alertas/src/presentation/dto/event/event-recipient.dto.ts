import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventRecipientDto {
  @ApiProperty({
    example: 'EMAIL',
    description:
      'Código del canal (EMAIL, TELEGRAM, TEAMS, WHATSAPP o código registrado en catálogo)',
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiPropertyOptional({ example: 'Solicitud de Vacaciones' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({
    example: 'Debe aprobar la solicitud VAC-001',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    example: ['usuario@email.com'],
    description: 'Destinatarios para canal EMAIL',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  to?: string[];

  @ApiPropertyOptional({
    example: [],
    description: 'Copia para canal EMAIL',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cc?: string[];

  @ApiPropertyOptional({
    example: [],
    description: 'Copia oculta para canal EMAIL',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bcc?: string[];

  @ApiPropertyOptional({
    example: '<b>Debe aprobar la solicitud VAC-001</b>',
    description: 'Cuerpo HTML para canal EMAIL',
  })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiPropertyOptional({
    example: [],
    description: 'Adjuntos para canal EMAIL',
  })
  @IsOptional()
  @IsArray()
  attachments?: unknown[];

  @ApiPropertyOptional({
    example: '123456789',
    description: 'Chat ID para canal TELEGRAM',
  })
  @IsOptional()
  @IsString()
  chatId?: string;

  @ApiPropertyOptional({
    example: '+59170000000',
    description: 'Teléfono para canal WHATSAPP',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'usuario@empresa.com',
    description: 'Correo o identificador para canal TEAMS',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Webhook específico del destinatario',
  })
  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @ApiPropertyOptional({
    description: 'Asistente para canal GOOGLE_CALENDAR',
  })
  @IsOptional()
  @IsString()
  attendee?: string;

  @ApiPropertyOptional({ description: 'Destino genérico' })
  @IsOptional()
  @IsString()
  target?: string;
}

export class EventPayloadDto {
  @ApiPropertyOptional({
    type: [EventRecipientDto],
    description:
      'Lista dinámica de destinatarios. Cada item define el canal y el cuerpo del mensaje.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventRecipientDto)
  recipients?: EventRecipientDto[];

  [key: string]: unknown;
}
