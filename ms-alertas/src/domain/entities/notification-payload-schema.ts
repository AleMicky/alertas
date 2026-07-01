import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';

export class NotificationPayloadSchema extends BaseAuditableEntity {
  id: string;
  notificationChannelId: string;
  name: string;
  description: string | null;
  version: number;
  schemaJson: Record<string, unknown>;
  example: Record<string, unknown> | null;
  requiredFields: string[];
}