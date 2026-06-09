import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';

import { NotificationChannelEntity } from './notification-channel.entity';
import { SeverityLevelEntity } from './severity-level.entity';

@Entity('talert_rules')
export class AlertRuleEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 100,
  })
  code: string;

  @Column({
    length: 150,
  })
  name: string;

  @Column({
    name: 'event_type',
    length: 100,
  })
  eventType: string;

  @ManyToOne(() => SeverityLevelEntity)
  @JoinColumn({
    name: 'severity_level_id',
  })
  severityLevel: SeverityLevelEntity;

  @ManyToOne(() => NotificationChannelEntity)
  @JoinColumn({
    name: 'notification_channel_id',
  })
  notificationChannel: NotificationChannelEntity;

  @Column({
    name: 'title_template',
    length: 200,
  })
  titleTemplate: string;

  @Column({
    name: 'message_template',
    type: 'text',
  })
  messageTemplate: string;

  @Column({
    default: true,
  })
  active: boolean;
}
