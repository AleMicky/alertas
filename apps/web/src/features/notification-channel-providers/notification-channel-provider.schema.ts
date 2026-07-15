import { z } from 'zod';

import { ProviderAuthType } from './notification-channel-provider.types';

function parseOptionalJson(
  value: string | undefined,
  fieldName: string,
): Record<string, unknown> | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`${fieldName} debe ser un objeto JSON`);
    }

    return parsed as Record<string, unknown>;
  } catch {
    throw new Error(`${fieldName} debe ser un JSON válido`);
  }
}

const providerFormSchema = z.object({
  notificationChannelId: z.string().uuid('Selecciona un canal'),
  code: z.string().min(2, 'Código requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  webhookUrl: z.string().url('URL de webhook inválida'),
  authType: z.enum([
    ProviderAuthType.NONE,
    ProviderAuthType.API_KEY,
    ProviderAuthType.BEARER,
    ProviderAuthType.BASIC,
  ]),
  authConfigJson: z.string().optional(),
  headersJson: z.string().optional(),
  timeoutSeconds: z.number().min(1, 'Mínimo 1 segundo'),
  retryEnabled: z.boolean(),
  maxAttempts: z.number().min(1, 'Mínimo 1 intento'),
});

export const createNotificationChannelProviderSchema = providerFormSchema.superRefine(
  (values, context) => {
    let authConfig: Record<string, unknown> | undefined;

    try {
      authConfig = parseOptionalJson(values.authConfigJson, 'authConfig');
    } catch (error) {
      context.addIssue({
        code: 'custom',
        message:
          error instanceof Error ? error.message : 'authConfig inválido',
        path: ['authConfigJson'],
      });
    }

    try {
      parseOptionalJson(values.headersJson, 'headers');
    } catch (error) {
      context.addIssue({
        code: 'custom',
        message: error instanceof Error ? error.message : 'headers inválido',
        path: ['headersJson'],
      });
    }

    if (values.authType === ProviderAuthType.API_KEY) {
      if (typeof authConfig?.apiKey !== 'string' || !authConfig.apiKey.trim()) {
        context.addIssue({
          code: 'custom',
          message: 'authConfig.apiKey es requerido para API_KEY',
          path: ['authConfigJson'],
        });
      }
    }

    if (values.authType === ProviderAuthType.BEARER) {
      if (typeof authConfig?.token !== 'string' || !authConfig.token.trim()) {
        context.addIssue({
          code: 'custom',
          message: 'authConfig.token es requerido para BEARER',
          path: ['authConfigJson'],
        });
      }
    }

    if (values.authType === ProviderAuthType.BASIC) {
      if (typeof authConfig?.username !== 'string' || !authConfig.username.trim()) {
        context.addIssue({
          code: 'custom',
          message: 'authConfig.username es requerido para BASIC',
          path: ['authConfigJson'],
        });
      }

      if (typeof authConfig?.password !== 'string' || !authConfig.password.trim()) {
        context.addIssue({
          code: 'custom',
          message: 'authConfig.password es requerido para BASIC',
          path: ['authConfigJson'],
        });
      }
    }
  },
);

export const updateNotificationChannelProviderSchema =
  providerFormSchema
    .omit({ notificationChannelId: true, code: true })
    .partial();

export type NotificationChannelProviderFormValues = z.infer<
  typeof providerFormSchema
>;

export type CreateNotificationChannelProviderDto = {
  notificationChannelId: string;
  code: string;
  name: string;
  webhookUrl: string;
  authType: NotificationChannelProviderFormValues['authType'];
  authConfig?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  timeoutSeconds: number;
  retryEnabled: boolean;
  maxAttempts: number;
};

export type UpdateNotificationChannelProviderDto = Partial<
  Omit<CreateNotificationChannelProviderDto, 'notificationChannelId' | 'code'>
>;

export const defaultNotificationChannelProviderForm: NotificationChannelProviderFormValues =
  {
    notificationChannelId: '',
    code: '',
    name: '',
    webhookUrl: '',
    authType: ProviderAuthType.NONE,
    authConfigJson: '',
    headersJson: '',
    timeoutSeconds: 30,
    retryEnabled: true,
    maxAttempts: 3,
  };

export function toCreateNotificationChannelProviderDto(
  values: NotificationChannelProviderFormValues,
): CreateNotificationChannelProviderDto {
  const parsed = createNotificationChannelProviderSchema.parse(values);

  return {
    notificationChannelId: parsed.notificationChannelId,
    code: parsed.code.trim().toUpperCase(),
    name: parsed.name.trim(),
    webhookUrl: parsed.webhookUrl.trim(),
    authType: parsed.authType,
    authConfig: parseOptionalJson(parsed.authConfigJson, 'authConfig'),
    headers: parseOptionalJson(parsed.headersJson, 'headers'),
    timeoutSeconds: parsed.timeoutSeconds,
    retryEnabled: parsed.retryEnabled,
    maxAttempts: parsed.maxAttempts,
  };
}

export function toUpdateNotificationChannelProviderDto(
  values: NotificationChannelProviderFormValues,
): UpdateNotificationChannelProviderDto {
  const createDto = toCreateNotificationChannelProviderDto(values);
  const { notificationChannelId: _channelId, code: _code, ...updateDto } =
    createDto;

  return updateDto;
}

export function providerToFormValues(
  provider: import('./notification-channel-provider.types').NotificationChannelProvider,
): NotificationChannelProviderFormValues {
  return {
    notificationChannelId: provider.notificationChannelId,
    code: provider.code,
    name: provider.name,
    webhookUrl: provider.webhookUrl,
    authType: provider.authType,
    authConfigJson: provider.authConfig
      ? JSON.stringify(provider.authConfig, null, 2)
      : '',
    headersJson: provider.headers
      ? JSON.stringify(provider.headers, null, 2)
      : '',
    timeoutSeconds: provider.timeoutSeconds,
    retryEnabled: provider.retryEnabled,
    maxAttempts: provider.maxAttempts,
  };
}
