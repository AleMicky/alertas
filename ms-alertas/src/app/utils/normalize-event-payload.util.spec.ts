import { BadRequestException } from '@nestjs/common';

import { normalizeEventPayload } from './normalize-event-payload.util';

const eventTypeCode = 'VEHICLE_REQUEST_APPROVED';

describe('normalizeEventPayload', () => {
  it('deriva title y message desde recipients', () => {
    const result = normalizeEventPayload(
      {
        recipients: [
          {
            channel: 'EMAIL',
            to: ['user@test.com'],
            subject: 'Solicitud de Vacaciones',
            message: 'Debe aprobar la solicitud VAC-001',
            html: '<b>Vacaciones</b>',
            cc: [],
            bcc: [],
            attachments: [],
          },
        ],
      },
      eventTypeCode,
    );

    expect(result.title).toBe('Solicitud de Vacaciones');
    expect(result.message).toBe('Debe aprobar la solicitud VAC-001');
    expect(result.payloadJson.recipients).toHaveLength(1);
  });

  it('acepta varios recipients de distintos canales', () => {
    const result = normalizeEventPayload(
      {
        recipients: [
          {
            channel: 'EMAIL',
            to: ['user@test.com'],
            subject: 'Correo',
            message: 'Mensaje email',
          },
          {
            channel: 'TELEGRAM',
            chatId: '123',
            message: 'Mensaje telegram',
          },
        ],
      },
      eventTypeCode,
    );

    expect(result.payloadJson.recipients).toHaveLength(2);
  });

  it('usa title y message del dto cuando se envían', () => {
    const result = normalizeEventPayload(
      {
        recipients: [
          {
            channel: 'EMAIL',
            to: ['user@test.com'],
            subject: 'Ignorado',
            message: 'Ignorado',
          },
        ],
      },
      eventTypeCode,
      'Título explícito',
      'Mensaje explícito',
    );

    expect(result.title).toBe('Título explícito');
    expect(result.message).toBe('Mensaje explícito');
  });

  it('rechaza recipient sin destino válido', () => {
    expect(() =>
      normalizeEventPayload(
        {
          recipients: [{ channel: 'EMAIL', to: [] }],
        },
        eventTypeCode,
      ),
    ).toThrow(BadRequestException);
  });
});
