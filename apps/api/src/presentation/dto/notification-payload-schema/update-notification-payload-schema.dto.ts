import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateNotificationPayloadSchemaDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Schema para notificaciones de correo',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
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
  @IsOptional()
  @IsObject()
  schemaJson?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: Object,
    nullable: true,
    example: {
      to: ['usuario@empresa.com'],
      subject: 'Solicitud aprobada',
      message: 'Su solicitud fue aprobada',
    },
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsObject()
  example?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    type: [String],
    example: ['to', 'subject', 'message'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredFields?: string[];

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
