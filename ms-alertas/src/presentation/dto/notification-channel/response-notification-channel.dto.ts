 import { BaseAuditSchema } from '../../schemas/base-audit.schema';

export class NotificationChannelResponseDto extends BaseAuditSchema {
  id: string;
  code: string;
  name: string;
  webhookUrl: string;
  description?: string;
  payloadSchemaJson?: Record<string, unknown>;
  payloadExampleJson?: Record<string, unknown>;
}
