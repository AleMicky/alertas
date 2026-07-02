import { BaseRepository } from 'src/shared/core/base.repository';
import { NotificationRequestAuditData } from '../entities/notification-request-audit';

export abstract class NotificationRequestAuditRepository extends BaseRepository<NotificationRequestAuditData> {
  abstract findAllByNotificationRequestId(
    notificationRequestId: string,
  ): Promise<NotificationRequestAuditData[]>;
}
