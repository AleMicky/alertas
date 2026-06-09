import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';

import { AlertEntity } from './alert.entity';
import { NotificationChannelEntity } from './notification-channel.entity';

@Entity('talert_notifications')
export class AlertNotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AlertEntity)
  @JoinColumn({ name: 'alert_id' })
  alert: AlertEntity;

  @ManyToOne(() => NotificationChannelEntity)
  @JoinColumn({ name: 'notification_channel_id' })
  notificationChannel: NotificationChannelEntity;

  @Column({ length: 255 })
  target: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ length: 50, default: AlertNotificationStatus.PENDING })
  status: AlertNotificationStatus;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ name: 'response_json', type: 'jsonb', nullable: true })
  responseJson?: Record<string, any>;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @Column({
    name: 'payload_json',
    type: 'jsonb',
    nullable: true,
  })
  payloadJson?: Record<string, any>;
}
