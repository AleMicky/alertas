import { AlertNotification } from 'src/domain/entities/alert-notification';
import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { EventRecipient } from 'src/domain/types/event-payload.type';

import { buildAlertNotificationPayload } from './build-alert-notification-payload.util';
import {
  buildN8nNotificationPayload,
  resolveNotificationMessage,
  resolveNotificationTitle,
} from './build-n8n-notification-payload.util';

const emailChannel = {
  code: 'EMAIL_ALERTS',
} as NotificationChannel;

describe('buildAlertNotificationPayload', () => {
  it('extrae target y payload sin channel', () => {
    const recipient: EventRecipient = {
      channel: 'EMAIL_ALERTS',
      to: ['user@test.com'],
      subject: 'Asunto',
      message: 'Mensaje',
    };

    const result = buildAlertNotificationPayload(recipient, emailChannel);

    expect(result.target).toBe('user@test.com');
    expect(result.payloadJson).toEqual({
      to: ['user@test.com'],
      subject: 'Asunto',
      message: 'Mensaje',
    });
  });
});

describe('buildN8nNotificationPayload', () => {
  it('arma el body completo para n8n', () => {
    const notification = {
      id: 'notification-id',
      target: 'user@test.com',
      payloadJson: {
        to: ['user@test.com'],
        subject: 'Solicitud de Vacaciones',
        message: 'Debe aprobar la solicitud VAC-001',
      },
      notificationChannel: {
        code: 'EMAIL_ALERTS',
        webhookUrl: 'http://localhost/webhook',
      },
      alert: {
        id: 'alert-id',
        event: {
          id: 'event-id',
          payloadJson: {
            metadata: {
              reference: 'SOL-001',
              requestId: 'SOL-001',
            },
          },
          eventTypeCode: 'PRUEBA',
          clientSystem: {
            code: 'RRHH',
            name: 'RRHH',
          },
        },
      },
    } as unknown as AlertNotification;

    const result = buildN8nNotificationPayload(notification);

    expect(result).toMatchObject({
      notificationId: 'notification-id',
      alertId: 'alert-id',
      eventId: 'event-id',
      channel: 'EMAIL_ALERTS',
      channelKind: 'EMAIL',
      target: 'user@test.com',
      title: 'Solicitud de Vacaciones',
      message: 'Debe aprobar la solicitud VAC-001',
      reference: 'SOL-001',
      metadata: {
        reference: 'SOL-001',
        requestId: 'SOL-001',
      },
      eventType: {
        code: 'PRUEBA',
      },
      clientSystem: {
        code: 'RRHH',
        name: 'RRHH',
      },
    });
  });
});

describe('resolveNotificationTitle', () => {
  it('prioriza subject y luego title', () => {
    expect(
      resolveNotificationTitle({ subject: 'Asunto', title: 'Título' }),
    ).toBe('Asunto');
    expect(resolveNotificationTitle({ title: 'Título' }, 'Evento')).toBe(
      'Título',
    );
    expect(resolveNotificationTitle({}, 'Evento')).toBe('Evento');
  });
});

describe('resolveNotificationMessage', () => {
  it('prioriza message del payload', () => {
    expect(
      resolveNotificationMessage(
        { message: 'Mensaje' },
        'Descripción',
        'Título',
      ),
    ).toBe('Mensaje');
  });
});
