import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseAuditColumns {
  @Column({
    name: 'created_by',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  createdBy!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  updatedBy!: string | null;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt!: Date;
}
