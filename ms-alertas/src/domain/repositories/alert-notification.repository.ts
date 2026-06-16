import { BaseRepository } from 'src/shared/core/base.repository';
import { AlertNotification } from '../entities/alert-notification';

export interface AlertNotificationStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

export abstract class AlertNotificationRepository extends BaseRepository<AlertNotification> {
  abstract findByAlertId(alertId: string): Promise<AlertNotification[]>;

  abstract findByStatus(status: string): Promise<AlertNotification[]>;

  abstract countStatsByAlertIds(
    alertIds: string[],
  ): Promise<Record<string, AlertNotificationStats>>;
}
