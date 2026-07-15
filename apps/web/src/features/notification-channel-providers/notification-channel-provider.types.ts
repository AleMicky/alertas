import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export const ProviderAuthType = {
  NONE: 'NONE',
  API_KEY: 'API_KEY',
  BEARER: 'BEARER',
  BASIC: 'BASIC',
} as const;

export type ProviderAuthTypeValue =
  (typeof ProviderAuthType)[keyof typeof ProviderAuthType];

export interface NotificationChannelProvider extends BaseAuditableEntity {
  id: string;
  notificationChannelId: string;
  code: string;
  name: string;
  webhookUrl: string;
  authType: ProviderAuthTypeValue;
  authConfig?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  timeoutSeconds: number;
  retryEnabled: boolean;
  maxAttempts: number;
  active: boolean;
}

export interface ProviderValidationResult {
  valid: boolean;
  errors: string[];
}

export interface TestNotificationChannelProviderDto {
  target?: string;
  title?: string;
  message?: string;
  payload?: Record<string, unknown>;
}

export interface TestNotificationChannelProviderResult {
  providerId: string;
  webhookUrl: string;
  request: Record<string, unknown>;
  response: unknown;
}
