import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProviderAuthType } from 'src/domain/enums';
import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';
import { NotificationChannelEntity } from './notification-channel.entity';

@Entity({ name: 'tnotification_channel_providers' })
@Index(['notificationChannelId', 'code'], { unique: true })
export class NotificationChannelProviderEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'notification_channel_id' })
  notificationChannelId: string;

  @ManyToOne(() => NotificationChannelEntity, { nullable: false })
  @JoinColumn({ name: 'notification_channel_id' })
  notificationChannel: NotificationChannelEntity;

  @Column({ length: 100 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'webhook_url', length: 500 })
  webhookUrl: string;

  @Column({
    name: 'auth_type',
    type: 'enum',
    enum: ProviderAuthType,
    default: ProviderAuthType.NONE,
  })
  authType: ProviderAuthType;

  @Column({ name: 'auth_config', type: 'jsonb', nullable: true })
  authConfig?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  headers?: Record<string, unknown>;

  @Column({ name: 'timeout_seconds', default: 30 })
  timeoutSeconds: number;

  @Column({ name: 'retry_enabled', default: true })
  retryEnabled: boolean;

  @Column({ name: 'max_attempts', default: 3 })
  maxAttempts: number;
}
