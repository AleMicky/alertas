import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export interface ClientSystemToken extends BaseAuditableEntity {
    id: string;
    clientSystemId: string;
    token: string;
    expiresAt?: string | null;
    active: boolean;
}

export interface GenerateClientSystemTokenResponse {
    message: string;
    token: string;
}
