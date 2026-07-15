import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export interface ClientSystem extends BaseAuditableEntity {
    id: string;
    code: string;
    name: string;
    description?: string;
    active: boolean;
}