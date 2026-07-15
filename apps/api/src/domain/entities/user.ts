import { BaseAuditableEntity } from "src/shared/core/base-auditable-entity";
import { Role } from "./role";

export class User extends BaseAuditableEntity {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    roles?: Role[];
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: Date | null;
}