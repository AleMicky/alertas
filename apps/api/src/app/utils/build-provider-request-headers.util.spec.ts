import { ProviderAuthType } from 'src/domain/enums';

import { buildProviderRequestHeaders } from './build-provider-request-headers.util';

describe('buildProviderRequestHeaders', () => {
  it('agrega header de API key', () => {
    const headers = buildProviderRequestHeaders({
      authType: ProviderAuthType.API_KEY,
      authConfig: { apiKey: 'secret-key' },
    });

    expect(headers['X-API-Key']).toBe('secret-key');
  });

  it('agrega Authorization Bearer', () => {
    const headers = buildProviderRequestHeaders({
      authType: ProviderAuthType.BEARER,
      authConfig: { token: 'abc123' },
    });

    expect(headers.Authorization).toBe('Bearer abc123');
  });

  it('combina headers personalizados con auth', () => {
    const headers = buildProviderRequestHeaders({
      authType: ProviderAuthType.NONE,
      headers: { 'X-Trace-Id': 'trace-1' },
    });

    expect(headers['X-Trace-Id']).toBe('trace-1');
  });
});
