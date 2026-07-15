import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationPayloadSchema } from '../entities/notification-payload-schema';

export abstract class NotificationPayloadSchemaRepository extends BaseRepository<NotificationPayloadSchema> {
  abstract findAllByNotificationChannelId(
    notificationChannelId: string,
  ): Promise<NotificationPayloadSchema[]>;

  abstract findActiveByNotificationChannelId(
    notificationChannelId: string,
  ): Promise<NotificationPayloadSchema | null>;

  abstract findActiveByChannelCode(
    channelCode: string,
  ): Promise<NotificationPayloadSchema | null>;

  abstract findByNotificationChannelIdAndVersion(
    notificationChannelId: string,
    version: number,
  ): Promise<NotificationPayloadSchema | null>;

  abstract findMaxVersionByNotificationChannelId(
    notificationChannelId: string,
  ): Promise<number>;

  abstract deactivateAllByNotificationChannelId(
    notificationChannelId: string,
    exceptId?: string,
  ): Promise<void>;
}
