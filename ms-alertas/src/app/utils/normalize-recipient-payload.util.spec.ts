import { BadRequestException } from '@nestjs/common';

import { NotificationChannel } from 'src/domain/entities/notification-channel';

import { normalizeRecipientPayload } from './normalize-recipient-payload.util';

const telegramChannel = {
  code: 'TELEGRAM_OPS',
} as unknown as NotificationChannel;

const emailChannel = {
  code: 'EMAIL_ALERTS',
} as unknown as NotificationChannel;

describe('normalizeRecipientPayload', () => {
  it('normaliza el código del canal al valor persistido', () => {
    const result = normalizeRecipientPayload(
      {
        channel: 'TELEGRAM',
        chatId: '123',
        message: 'Hola',
      },
      telegramChannel,
      0,
    );

    expect(result.channel).toBe('TELEGRAM_OPS');
    expect(result.chatId).toBe('123');
    expect(result.message).toBe('Hola');
  });

  it('normaliza recipient de email con destino válido', () => {
    const result = normalizeRecipientPayload(
      {
        channel: 'EMAIL',
        to: ['miguel.mamani.pxp@gmail.com'],
        subject: 'Solicitud de Vacaciones',
        message: 'Debe aprobar la solicitud VAC-001',
      },
      emailChannel,
      0,
    );

    expect(result).toEqual({
      channel: 'EMAIL_ALERTS',
      to: ['miguel.mamani.pxp@gmail.com'],
      subject: 'Solicitud de Vacaciones',
      message: 'Debe aprobar la solicitud VAC-001',
    });
  });

  it('rechaza destinos inválidos', () => {
    expect(() =>
      normalizeRecipientPayload(
        {
          channel: 'TELEGRAM_OPS',
        },
        telegramChannel,
        0,
      ),
    ).toThrow(BadRequestException);
  });
});
