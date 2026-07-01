import { ProviderAuthType } from 'src/domain/enums';

import { validateNotificationChannelProviderConfiguration } from './validate-notification-channel-provider.util';

describe('validateNotificationChannelProviderConfiguration', () => {
  it('acepta configuración válida sin autenticación', () => {
    const result = validateNotificationChannelProviderConfiguration({
      webhookUrl: 'https://n8n.example.com/webhook/telegram',
      authType: ProviderAuthType.NONE,
      timeoutSeconds: 30,
      maxAttempts: 3,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('requiere apiKey para API_KEY', () => {
    const result = validateNotificationChannelProviderConfiguration({
      webhookUrl: 'https://n8n.example.com/webhook/telegram',
      authType: ProviderAuthType.API_KEY,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('authConfig.apiKey es requerido para API_KEY');
  });

  it('requiere token para BEARER', () => {
    const result = validateNotificationChannelProviderConfiguration({
      webhookUrl: 'https://n8n.example.com/webhook/telegram',
      authType: ProviderAuthType.BEARER,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('authConfig.token es requerido para BEARER');
  });

  it('rechaza webhook inválido', () => {
    const result = validateNotificationChannelProviderConfiguration({
      webhookUrl: 'not-a-url',
      authType: ProviderAuthType.NONE,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'webhookUrl debe ser una URL http o https válida',
    );
  });
});
