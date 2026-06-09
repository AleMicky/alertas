import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';

@Entity({ name: 'tseverity_levels' })
export class SeverityLevelEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 500 })
  description?: string;

  @Column({ default: 1 })
  priority: number;

  @Column({
    name: 'attention_time_minutes',
    nullable: true,
  })
  attentionTimeMinutes?: number;

  @Column({ default: true })
  active: boolean;
}
