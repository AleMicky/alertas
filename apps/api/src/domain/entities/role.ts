import { BaseAuditableEntity } from "src/shared/core/base-auditable-entity";

export class Role extends BaseAuditableEntity {
    id: string;
    code: string;
    name: string;
  }