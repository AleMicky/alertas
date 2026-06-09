import { BadRequestException } from '@nestjs/common';

import { EventType } from 'src/domain/entities/event-type';
import { normalizeEventPayload } from './normalize-event-payload.util';

const eventType = {
  name: 'Solicitud aprobada',
  description: 'Evento de aprobación',
} as EventType;

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
      eventType,
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
      eventType,
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
      eventType,
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
        eventType,
      ),
    ).toThrow(BadRequestException);
  });
});
