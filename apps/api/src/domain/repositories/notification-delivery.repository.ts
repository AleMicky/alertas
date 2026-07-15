import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationDeliveryData } from '../entities/notification-delivery';

export abstract class NotificationDeliveryRepository extends BaseRepository<NotificationDeliveryData> {
  abstract findAllByNotificationRequestId(
    notificationRequestId: string,
  ): Promise<NotificationDeliveryData[]>;

  abstract findAllByRecipientId(
    notificationRecipientId: string,
  ): Promise<NotificationDeliveryData[]>;

  abstract findFailedByNotificationRequestId(
    notificationRequestId: string,
  ): Promise<NotificationDeliveryData[]>;

  abstract createMany(
    deliveries: Partial<NotificationDeliveryData>[],
  ): Promise<NotificationDeliveryData[]>;
}
