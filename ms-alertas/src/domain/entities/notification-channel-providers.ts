import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';
import { ProviderAuthType } from '../enums';

export class NotificationChannelProvider extends BaseAuditableEntity {
  id: string;
  notificationChannelId: string;
  code: string;
  name: string;
  webhookUrl: string;
  authType: ProviderAuthType;
  authConfig?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  timeoutSeconds: number;
  retryEnabled: boolean;
  maxAttempts: number;
}
