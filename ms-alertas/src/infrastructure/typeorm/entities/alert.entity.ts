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
export class AlertEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventEntity)
  @JoinColumn({
    name: 'event_id',
  })
  event: EventEntity;

  @ManyToOne(() => AlertRuleEntity)
  @JoinColumn({
    name: 'alert_rule_id',
  })
  alertRule: AlertRuleEntity;

  @ManyToOne(() => SeverityLevelEntity)
  @JoinColumn({
    name: 'severity_level_id',
  })
  severityLevel: SeverityLevelEntity;

  @Column({
    length: 200,
  })
  title: string;

  @Column({
    type: 'text',
  })
  message: string;

  @Column({
    length: 50,
    default: AlertStatus.OPEN,
  })
  status: AlertStatus;

  @Column({
    name: 'alert_date',
    type: 'timestamp',
  })
  alertDate: Date;

  @Column({
    name: 'attended_at',
    type: 'timestamp',
    nullable: true,
  })
  attendedAt?: Date;

  @Column({
    default: true,
  })
  active: boolean;
}
