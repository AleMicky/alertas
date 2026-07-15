import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseAuditSchema } from '../../schemas/base-audit.schema';

export class NotificationPayloadSchemaResponseDto extends BaseAuditSchema {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  notificationChannelId: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  description: string | null;

  @ApiProperty({ type: Number })
  version: number;

  @ApiProperty({ type: Object })
  schemaJson: Record<string, unknown>;

  @ApiPropertyOptional({ type: Object, nullable: true })
  example: Record<string, unknown> | null;

  @ApiProperty({ type: [String] })
  requiredFields: string[];

  @ApiProperty({ type: Boolean })
  active: boolean;
}
