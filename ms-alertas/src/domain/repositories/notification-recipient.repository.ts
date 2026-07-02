import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationRecipientData } from '../entities/notification-recipient';

export abstract class NotificationRecipientRepository extends BaseRepository<NotificationRecipientData> {
  abstract findAllByNotificationRequestId(
    notificationRequestId: string,
  ): Promise<NotificationRecipientData[]>;

  abstract createMany(
    recipients: Partial<NotificationRecipientData>[],
  ): Promise<NotificationRecipientData[]>;
}
