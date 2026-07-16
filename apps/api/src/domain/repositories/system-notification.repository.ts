import { BaseRepository } from 'src/shared/core/base.repository';
import {
  SystemNotificationData,
  SystemNotificationWithReadState,
} from '../entities/system-notification';

export abstract class SystemNotificationRepository extends BaseRepository<SystemNotificationData> {
  abstract findForUser(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean },
  ): Promise<SystemNotificationWithReadState[]>;

  abstract countUnreadForUser(userId: string): Promise<number>;

  abstract markAsRead(
    systemNotificationId: string,
    userId: string,
  ): Promise<SystemNotificationWithReadState | null>;

  abstract markAllAsRead(userId: string): Promise<number>;
}
