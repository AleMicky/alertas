import { BaseRepository } from "src/shared/core/base.repository";
import { NotificationProvider } from "../entities";


export abstract class NotificationProviderRepository extends BaseRepository<NotificationProvider> {
    abstract findByCode(code: string): Promise<NotificationProvider | null>;
    abstract findByClientSystemChannelAndCode(
      clientSystemId: string,
      notificationChannelId: string,
      code: string,
    ): Promise<NotificationProvider | null>;
    abstract findByNotificationChannelId(notificationChannelId: string): Promise<NotificationProvider[]>;
    abstract findByClientSystemId(clientSystemId: string): Promise<NotificationProvider[]>;
}