import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';

import { AlertStatus } from 'src/domain/enums/alert-status.enum';

import { AlertRuleEntity } from './alert-rule.entity';
import { SeverityLevelEntity } from './severity-level.entity';
import { EventEntity } from './event.entity';

@Entity('alerts')
export class AlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventEntity)
  @JoinColumn({
    name: 'event_id',
  })
  event: EventEntity;

  @Column({
    length: 50,
    default: AlertStatus.OPEN,
  })
  status: AlertStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'notified_at',
    type: 'timestamp',
    nullable: true,
  })
  notifiedAt?: Date | null;

  @Column({
    name: 'failed_at',
    type: 'timestamp',
    nullable: true,
  })
  failedAt?: Date | null;


}
