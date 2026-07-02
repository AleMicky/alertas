import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { NotificationDeliveryStatus } from 'src/domain/enums';
import { NotificationChannelProviderEntity } from './notification-channel-provider.entity';
import { NotificationRecipientEntity } from './notification-recipient.entity';
import { NotificationRequestEntity } from './notification-request.entity';

@Entity({ name: 'tnotification_deliveries' })
@Index(['notificationRequestId'])
@Index(['notificationRecipientId'])
@Index(['status'])
export class NotificationDeliveryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'notification_request_id' })
  notificationRequestId: string;

  @ManyToOne(() => NotificationRequestEntity, { nullable: false })
  @JoinColumn({ name: 'notification_request_id' })
  notificationRequest: NotificationRequestEntity;

  @Column({ name: 'notification_recipient_id' })
  notificationRecipientId: string;

  @ManyToOne(() => NotificationRecipientEntity, { nullable: false })
  @JoinColumn({ name: 'notification_recipient_id' })
  notificationRecipient: NotificationRecipientEntity;

  @Column({ name: 'notification_channel_provider_id', nullable: true })
  notificationChannelProviderId: string | null;

  @ManyToOne(() => NotificationChannelProviderEntity, { nullable: true })
  @JoinColumn({ name: 'notification_channel_provider_id' })
  notificationChannelProvider: NotificationChannelProviderEntity | null;

  @Column({
    type: 'enum',
    enum: NotificationDeliveryStatus,
    default: NotificationDeliveryStatus.PENDING,
  })
  status: NotificationDeliveryStatus;

  @Column({ name: 'attempt_count', type: 'int', default: 0 })
  attemptCount: number;

  @Column({ name: 'provider_message_id', type: 'varchar', length: 255, nullable: true })
  providerMessageId: string | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'last_attempt_at', type: 'timestamp', nullable: true })
  lastAttemptAt: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt: Date | null;

  @Column({ name: 'failed_at', type: 'timestamp', nullable: true })
  failedAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
