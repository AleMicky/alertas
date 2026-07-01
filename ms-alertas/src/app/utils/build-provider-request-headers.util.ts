import { NotificationChannelProvider } from 'src/domain/entities/notification-channel-providers';
import { ProviderAuthType } from 'src/domain/enums';

function asStringRecord(
  headers?: Record<string, unknown>,
): Record<string, string> {
  if (!headers) {
    return {};
  }

  return Object.entries(headers).reduce<Record<string, string>>(
    (accumulator, [key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        accumulator[key] = value.trim();
      }

      return accumulator;
    },
    {},
  );
}

export function buildProviderRequestHeaders(
  provider: Pick<
    NotificationChannelProvider,
    'authType' | 'authConfig' | 'headers'
  >,
): Record<string, string> {
  const requestHeaders = asStringRecord(provider.headers);

  switch (provider.authType) {
    case ProviderAuthType.API_KEY: {
      const apiKey =
        typeof provider.authConfig?.apiKey === 'string'
          ? provider.authConfig.apiKey.trim()
          : '';
      const headerName =
        typeof provider.authConfig?.headerName === 'string' &&
        provider.authConfig.headerName.trim()
          ? provider.authConfig.headerName.trim()
          : 'X-API-Key';

      if (apiKey) {
        requestHeaders[headerName] = apiKey;
      }
      break;
    }
    case ProviderAuthType.BEARER: {
      const token =
        typeof provider.authConfig?.token === 'string'
          ? provider.authConfig.token.trim()
          : '';

      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
      break;
    }
    case ProviderAuthType.BASIC: {
      const username =
        typeof provider.authConfig?.username === 'string'
          ? provider.authConfig.username
          : '';
      const password =
        typeof provider.authConfig?.password === 'string'
          ? provider.authConfig.password
          : '';

      if (username && password) {
        requestHeaders.Authorization = `Basic ${Buffer.from(
          `${username}:${password}`,
        ).toString('base64')}`;
      }
      break;
    }
    case ProviderAuthType.NONE:
    default:
      break;
  }

  return requestHeaders;
}
