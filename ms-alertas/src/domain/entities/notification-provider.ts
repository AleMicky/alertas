import { BaseAuditableEntity } from "src/shared/core/base-auditable-entity";

export class NotificationProvider extends BaseAuditableEntity {
    id: string;
    clientSystemId: string;
    notificationChannelId: string;
    code: string;
    name: string;
}