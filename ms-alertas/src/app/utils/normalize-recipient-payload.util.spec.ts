import { BadRequestException } from '@nestjs/common';

import { NotificationChannel } from 'src/domain/entities/notification-channel';

import {
  applyChannelPayloadDefaults,
  getChannelRequiredFields,
  isPayloadFieldPresent,
  normalizeRecipientPayload,
} from './normalize-recipient-payload.util';

const telegramChannel = {
  code: 'TELEGRAM_OPS',
  payloadSchemaJson: {
    required: ['chatId', 'message'],
  },
  payloadBodyJson: {
    chatId: 'string',
    message: 'string',
  },
} as unknown as NotificationChannel;

const emailChannel = {
  code: 'EMAIL_ALERTS',
  payloadSchemaJson: {
    required: ['to', 'subject', 'message'],
  },
  payloadBodyJson: {
    to: ['string'],
    cc: [],
    bcc: [],
    subject: 'string',
    message: 'string',
    html: 'string',
    attachments: [],
  },
} as unknown as NotificationChannel;

const legacyEmailChannel = {
  code: 'EMAIL_ALERTS',
} as unknown as NotificationChannel;

describe('normalizeRecipientPayload', () => {
  it('valida campos requeridos definidos en el canal', () => {
    const result = normalizeRecipientPayload(
      {
        channel: 'TELEGRAM_OPS',
        chatId: '123',
        message: 'Hola',
      },
      telegramChannel,
      0,
    );

    expect(result).toEqual({
      channel: 'TELEGRAM_OPS',
      chatId: '123',
      message: 'Hola',
    });
  });

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
  });

  it('normaliza recipient de email según payloadBodyJson del canal', () => {
    const result = normalizeRecipientPayload(
      {
        channel: 'EMAIL',
        to: ['miguel.mamani.pxp@gmail.com'],
        subject: 'Solicitud de Vacaciones',
        message: 'Debe aprobar la solicitud VAC-001',
        html: '<b>Debe aprobar la solicitud VAC-001</b>',
      },
      emailChannel,
      0,
    );

    expect(result).toEqual({
      channel: 'EMAIL_ALERTS',
      to: ['miguel.mamani.pxp@gmail.com'],
      cc: [],
      bcc: [],
      subject: 'Solicitud de Vacaciones',
      message: 'Debe aprobar la solicitud VAC-001',
      html: '<b>Debe aprobar la solicitud VAC-001</b>',
      attachments: [],
    });
  });

  it('rechaza campos requeridos faltantes', () => {
    expect(() =>
      normalizeRecipientPayload(
        {
          channel: 'TELEGRAM_OPS',
          chatId: '123',
        },
        telegramChannel,
        0,
      ),
    ).toThrow(BadRequestException);
  });

  it('rechaza campos no definidos en payloadBodyJson del canal', () => {
    expect(() =>
      normalizeRecipientPayload(
        {
          channel: 'EMAIL_ALERTS',
          to: ['user@test.com'],
          subject: 'Asunto',
          message: 'Mensaje',
          extraField: 'no permitido',
        },
        emailChannel,
        0,
      ),
    ).toThrow(BadRequestException);
  });

  it('usa validación legacy cuando el canal no define esquema', () => {
    const result = normalizeRecipientPayload(
      {
        channel: 'EMAIL',
        to: ['user@test.com'],
        subject: 'Asunto',
        message: 'Mensaje',
      },
      legacyEmailChannel,
      0,
    );

    expect(result.channel).toBe('EMAIL_ALERTS');
    expect(result.to).toEqual(['user@test.com']);
  });
});

describe('applyChannelPayloadDefaults', () => {
  it('aplica arreglos vacíos del body del canal como default', () => {
    const result = applyChannelPayloadDefaults(
      {
        to: ['user@test.com'],
        subject: 'Asunto',
        message: 'Mensaje',
      },
      emailChannel,
    );

    expect(result.cc).toEqual([]);
    expect(result.bcc).toEqual([]);
    expect(result.attachments).toEqual([]);
  });
});

describe('getChannelRequiredFields', () => {
  it('extrae la lista required del schema del canal', () => {
    expect(getChannelRequiredFields(telegramChannel)).toEqual([
      'chatId',
      'message',
    ]);
  });
});

describe('isPayloadFieldPresent', () => {
  it('considera vacíos los strings en blanco y arreglos vacíos', () => {
    expect(isPayloadFieldPresent('')).toBe(false);
    expect(isPayloadFieldPresent('   ')).toBe(false);
    expect(isPayloadFieldPresent([])).toBe(false);
    expect(isPayloadFieldPresent('ok')).toBe(true);
    expect(isPayloadFieldPresent(['a'])).toBe(true);
  });
});
