import { AlertOutcomeService } from './alert-outcome.service';
import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';
import { AlertStatus } from 'src/domain/enums/alert-status.enum';
import { EventStatus } from 'src/domain/enums/event-status.enum';

describe('AlertOutcomeService', () => {
  const alertNotificationRepository = {
    findByAlertId: jest.fn(),
  };
  const alertRepository = {
    update: jest.fn(),
  };
  const eventRepository = {
    update: jest.fn(),
  };

  let service: AlertOutcomeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AlertOutcomeService(
      alertNotificationRepository as never,
      alertRepository as never,
      eventRepository as never,
    );
  });

  const baseNotification = (status: AlertNotificationStatus) => ({
    id: 'notif-1',
    status,
    alert: {
      id: 'alert-1',
      event: { id: 'event-1' },
    },
  });

  it('no actualiza si hay notificaciones en progreso', async () => {
    alertNotificationRepository.findByAlertId.mockResolvedValue([
      baseNotification(AlertNotificationStatus.SENT),
      baseNotification(AlertNotificationStatus.PENDING),
    ]);

    await service.syncFromNotifications('alert-1');

    expect(alertRepository.update).not.toHaveBeenCalled();
    expect(eventRepository.update).not.toHaveBeenCalled();
  });

  it('marca alerta y evento como completados si todas fueron enviadas', async () => {
    alertNotificationRepository.findByAlertId.mockResolvedValue([
      baseNotification(AlertNotificationStatus.SENT),
      baseNotification(AlertNotificationStatus.SENT),
    ]);

    await service.syncFromNotifications('alert-1');

    expect(alertRepository.update).toHaveBeenCalledWith('alert-1', {
      status: AlertStatus.NOTIFIED,
    });
    expect(eventRepository.update).toHaveBeenCalledWith(
      'event-1',
      expect.objectContaining({ status: EventStatus.PROCESSED }),
    );
  });

  it('marca alerta y evento como fallidos si todas fallaron', async () => {
    alertNotificationRepository.findByAlertId.mockResolvedValue([
      baseNotification(AlertNotificationStatus.FAILED),
    ]);

    await service.syncFromNotifications('alert-1');

    expect(alertRepository.update).toHaveBeenCalledWith('alert-1', {
      status: AlertStatus.FAILED,
    });
    expect(eventRepository.update).toHaveBeenCalledWith(
      'event-1',
      expect.objectContaining({ status: EventStatus.FAILED }),
    );
  });

  it('marca resultado parcial cuando hay envíos y fallos', async () => {
    alertNotificationRepository.findByAlertId.mockResolvedValue([
      baseNotification(AlertNotificationStatus.SENT),
      baseNotification(AlertNotificationStatus.FAILED),
    ]);

    await service.syncFromNotifications('alert-1');

    expect(alertRepository.update).toHaveBeenCalledWith('alert-1', {
      status: AlertStatus.NOTIFIED,
    });
    expect(eventRepository.update).toHaveBeenCalledWith(
      'event-1',
      expect.objectContaining({ status: EventStatus.FAILED }),
    );
  });
});
