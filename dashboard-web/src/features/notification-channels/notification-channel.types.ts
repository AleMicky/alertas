import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export interface NotificationChannel extends BaseAuditableEntity {
    id: string;
    code: string;
    name: string;
    webhookUrl: string;
    description?: string;
    payloadSchemaJson?: Record<string, unknown>;
    payloadExampleJson?: Record<string, unknown>;
    /** Alias que puede enviar la API en snake_case */
    webhook_url?: string;
    payload_schema_json?: Record<string, unknown>;
    payload_example_json?: Record<string, unknown>;
}
