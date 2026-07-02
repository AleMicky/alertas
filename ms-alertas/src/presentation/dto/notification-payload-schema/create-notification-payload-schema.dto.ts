import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateNotificationPayloadSchemaDto {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del canal de notificación',
  })
  @IsUUID()
  @IsNotEmpty()
  notificationChannelId: string;

  @ApiProperty({ type: String, example: 'email-default' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Schema para notificaciones de correo',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @ApiProperty({
    type: Object,
    example: {
      type: 'object',
      required: ['to', 'subject', 'message'],
      properties: {
        to: { type: 'array', items: { type: 'string' } },
        subject: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @IsObject()
  schemaJson: Record<string, unknown>;

  @ApiPropertyOptional({
    type: Object,
    example: {
      to: ['usuario@empresa.com'],
      subject: 'Solicitud aprobada',
      message: 'Su solicitud fue aprobada',
    },
  })
  @IsOptional()
  @IsObject()
  example?: Record<string, unknown> | null;

  @ApiProperty({
    type: [String],
    example: ['to', 'subject', 'message'],
  })
  @IsArray()
  @IsString({ each: true })
  requiredFields: string[];

  @ApiPropertyOptional({
    type: Boolean,
    default: true,
    description:
      'Si es true, desactiva los demás schemas del canal y deja este como activo',
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
