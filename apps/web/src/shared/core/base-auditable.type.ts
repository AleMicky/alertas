export interface BaseAuditableEntity {
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}