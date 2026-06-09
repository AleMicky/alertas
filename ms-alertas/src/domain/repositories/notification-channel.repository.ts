import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationChannel } from '../entities/notification-channel';
import { NotificationChannelType } from '../enums/notification-channel-type.enum';

export abstract class NotificationChannelRepository extends BaseRepository<NotificationChannel> {
  abstract findByCode(code: string): Promise<NotificationChannel | null>;

  abstract findByRecipientChannel(
    code: string,
  ): Promise<NotificationChannel | null>;

  abstract findActiveByType(
    type: NotificationChannelType,
  ): Promise<NotificationChannel[]>;
}
