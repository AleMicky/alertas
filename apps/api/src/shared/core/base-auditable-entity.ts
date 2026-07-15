export abstract class BaseAuditableEntity {
  createdBy!: string | null;
  createdAt!: Date;
  updatedBy!: string | null;
  updatedAt!: Date;
  active!: boolean;
}
