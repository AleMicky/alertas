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

import {
  NotificationPriority,
  NotificationRequestStatus,
} from 'src/domain/enums';
import { ClientSystemEntity } from './client-system.entity';
import { NotificationChannelEntity } from './notification-channel.entity';

@Entity({ name: 'tnotification_requests' })
@Index(['clientSystemId', 'idempotencyKey'], {
  unique: true,
  where: '"idempotency_key" IS NOT NULL',
})
@Index(['status'])
@Index(['priority'])
@Index(['requestedAt'])
@Index(['externalReference'])
@Index(['correlationId'])
export class NotificationRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_system_id' })
  clientSystemId: string;

  @ManyToOne(() => ClientSystemEntity, { nullable: false })
  @JoinColumn({ name: 'client_system_id' })
  clientSystem: ClientSystemEntity;

  @Column({ name: 'notification_channel_id', nullable: true })
  notificationChannelId: string | null;

  @ManyToOne(() => NotificationChannelEntity, { nullable: true })
  @JoinColumn({ name: 'notification_channel_id' })
  notificationChannel: NotificationChannelEntity | null;

  @Column({ name: 'external_reference', type: 'varchar', length: 255, nullable: true })
  externalReference: string | null;

  @Column({ name: 'correlation_id', type: 'varchar', length: 255, nullable: true })
  correlationId: string | null;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 255, nullable: true })
  idempotencyKey: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'jsonb', default: {} })
  payload: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({
    type: 'enum',
    enum: NotificationRequestStatus,
    default: NotificationRequestStatus.RECEIVED,
  })
  status: NotificationRequestStatus;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt: Date | null;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt: Date | null;

  @Column({ name: 'requested_at', type: 'timestamp' })
  requestedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
