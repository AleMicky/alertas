import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationChannelProvider } from '../entities/notification-channel-providers';

export abstract class NotificationChannelProviderRepository extends BaseRepository<NotificationChannelProvider> {
  abstract findAllByNotificationChannelId(
    notificationChannelId: string,
  ): Promise<NotificationChannelProvider[]>;

  abstract findActiveByNotificationChannelId(
    notificationChannelId: string,
  ): Promise<NotificationChannelProvider[]>;

  abstract findDefaultByNotificationChannelId(
    notificationChannelId: string,
  ): Promise<NotificationChannelProvider | null>;

  abstract findByCodeAndNotificationChannelId(
    code: string,
    notificationChannelId: string,
  ): Promise<NotificationChannelProvider | null>;

  abstract findActiveByCodeAndNotificationChannelId(
    code: string,
    notificationChannelId: string,
  ): Promise<NotificationChannelProvider | null>;

  abstract findByChannelCode(
    channelCode: string,
  ): Promise<NotificationChannelProvider | null>;

  abstract findActiveByChannelCodeAndProviderCode(
    channelCode: string,
    providerCode: string,
  ): Promise<NotificationChannelProvider | null>;

  abstract deactivateAllByNotificationChannelId(
    notificationChannelId: string,
    exceptId?: string,
  ): Promise<void>;
}
