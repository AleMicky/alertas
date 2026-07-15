import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export interface NotificationPayloadSchema extends BaseAuditableEntity {
  id: string;
  notificationChannelId: string;
  name: string;
  description: string | null;
  version: number;
  schemaJson: Record<string, unknown>;
  example: Record<string, unknown> | null;
  requiredFields: string[];
  active: boolean;
}

export interface PayloadSchemaValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ValidatePayloadSchemaDto {
  payload: Record<string, unknown>;
}

export interface ValidateActiveChannelPayloadResult
  extends PayloadSchemaValidationResult {
  channelCode: string;
  schemaId: string;
  schemaVersion: number;
}
