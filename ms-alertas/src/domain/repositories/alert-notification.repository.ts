import { BaseRepository } from 'src/shared/core/base.repository';
import { AlertNotification } from '../entities/alert-notification';

export abstract class AlertNotificationRepository extends BaseRepository<AlertNotification> {
  abstract findByAlertId(alertId: string): Promise<AlertNotification[]>;

  abstract findByStatus(status: string): Promise<AlertNotification[]>;
}
