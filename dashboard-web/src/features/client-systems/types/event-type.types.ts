import { BaseAuditableEntity } from '@/shared/core/base-auditable.type';
import { ClientSystem } from './client-system.types';

export interface EventType extends BaseAuditableEntity {
    id: string;
    clientSystemId?: string;
    clientSystem?: ClientSystem;
    code: string;
    name: string;
    description?: string;
    active: boolean;
}
