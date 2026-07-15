import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationAttachmentData } from '../entities/notification-attachment';

export abstract class NotificationAttachmentRepository extends BaseRepository<NotificationAttachmentData> {
  abstract findAllByNotificationRequestId(
    notificationRequestId: string,
  ): Promise<NotificationAttachmentData[]>;

  abstract createMany(
    attachments: Partial<NotificationAttachmentData>[],
  ): Promise<NotificationAttachmentData[]>;
}
