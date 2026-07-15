import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationDeliveryAttemptData } from '../entities/notification-delivery-attempt';

export abstract class NotificationDeliveryAttemptRepository extends BaseRepository<NotificationDeliveryAttemptData> {
  abstract findAllByDeliveryId(
    notificationDeliveryId: string,
  ): Promise<NotificationDeliveryAttemptData[]>;

  abstract findAllByNotificationRequestId(
    notificationRequestId: string,
  ): Promise<NotificationDeliveryAttemptData[]>;
}
