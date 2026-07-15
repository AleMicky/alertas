import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProviderAuthType } from 'src/domain/enums';
import { BaseAuditSchema } from '../../schemas/base-audit.schema';

export class NotificationChannelProviderResponseDto extends BaseAuditSchema {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  notificationChannelId: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  webhookUrl: string;

  @ApiProperty({ enum: ProviderAuthType })
  authType: ProviderAuthType;

  @ApiPropertyOptional({ type: Object })
  authConfig?: Record<string, unknown>;

  @ApiPropertyOptional({ type: Object })
  headers?: Record<string, unknown>;

  @ApiProperty({ type: Number })
  timeoutSeconds: number;

  @ApiProperty({ type: Boolean })
  retryEnabled: boolean;

  @ApiProperty({ type: Number })
  maxAttempts: number;

  @ApiProperty({ type: Boolean })
  active: boolean;
}
