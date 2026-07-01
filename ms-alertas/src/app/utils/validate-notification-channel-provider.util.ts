import { ProviderAuthType } from 'src/domain/enums';

export type ProviderConfigurationInput = {
  webhookUrl?: string;
  authType?: ProviderAuthType;
  authConfig?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  timeoutSeconds?: number;
  maxAttempts?: number;
};

export type ProviderValidationResult = {
  valid: boolean;
  errors: string[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateAuthConfig(
  authType: ProviderAuthType,
  authConfig?: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  switch (authType) {
    case ProviderAuthType.NONE:
      break;
    case ProviderAuthType.API_KEY:
      if (!isNonEmptyString(authConfig?.apiKey)) {
        errors.push('authConfig.apiKey es requerido para API_KEY');
      }
      break;
    case ProviderAuthType.BEARER:
      if (!isNonEmptyString(authConfig?.token)) {
        errors.push('authConfig.token es requerido para BEARER');
      }
      break;
    case ProviderAuthType.BASIC:
      if (!isNonEmptyString(authConfig?.username)) {
        errors.push('authConfig.username es requerido para BASIC');
      }
      if (!isNonEmptyString(authConfig?.password)) {
        errors.push('authConfig.password es requerido para BASIC');
      }
      break;
  }

  return errors;
}

function validateHeaders(headers?: Record<string, unknown>): string[] {
  if (!headers) {
    return [];
  }

  const errors: string[] = [];

  for (const [key, value] of Object.entries(headers)) {
    if (!isNonEmptyString(key)) {
      errors.push('headers contiene claves inválidas');
      continue;
    }

    if (typeof value !== 'string') {
      errors.push(`headers.${key} debe ser un string`);
    }
  }

  return errors;
}

export function validateNotificationChannelProviderConfiguration(
  input: ProviderConfigurationInput,
): ProviderValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(input.webhookUrl)) {
    errors.push('webhookUrl es requerido');
  } else if (!isValidUrl(input.webhookUrl.trim())) {
    errors.push('webhookUrl debe ser una URL http o https válida');
  }

  if (!input.authType) {
    errors.push('authType es requerido');
  } else {
    errors.push(...validateAuthConfig(input.authType, input.authConfig));
  }

  errors.push(...validateHeaders(input.headers));

  if (input.timeoutSeconds !== undefined && input.timeoutSeconds < 1) {
    errors.push('timeoutSeconds debe ser mayor o igual a 1');
  }

  if (input.maxAttempts !== undefined && input.maxAttempts < 1) {
    errors.push('maxAttempts debe ser mayor o igual a 1');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
