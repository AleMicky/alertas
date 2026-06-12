import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';
import { AlertEntity } from './alert.entity';
import { NotificationChannelEntity } from './notification-channel.entity';

@Entity('talert_notifications')
export class AlertNotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AlertEntity, { nullable: false })
  @JoinColumn({ name: 'alert_id' })
  alert: AlertEntity;

  @ManyToOne(() => NotificationChannelEntity, { nullable: false })
  @JoinColumn({ name: 'notification_channel_id' })
  notificationChannel: NotificationChannelEntity;

  @Column({ length: 255, nullable: true })
  target?: string;

  @Column({
    name: 'payload_json',
    type: 'jsonb',
    nullable: true,
  })
  payloadJson?: Record<string, any>;

  @Index()
  @Column({
    type: 'enum',
    enum: AlertNotificationStatus,
    default: AlertNotificationStatus.PENDING,
  })
  status: AlertNotificationStatus; 

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({
    name: 'response_json',
    type: 'jsonb',
    nullable: true,
  })
  responseJson?: Record<string, any>;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;
}