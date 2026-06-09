export abstract class BaseAuditableEntity {
  createdBy!: string | null;
  createdAt!: Date | null;
  updatedBy!: string | null;
  updatedAt!: Date | null;
}
