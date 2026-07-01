 import { BaseAuditSchema } from '../../schemas/base-audit.schema';

export class NotificationChannelResponseDto extends BaseAuditSchema {
  id: string;
  code: string;
  name: string;
  webhookUrl: string;
  webhookToken?: string;
  description?: string;
  payloadSchemaJson?: Record<string, unknown>;
  payloadBodyJson?: Record<string, unknown>;
}
