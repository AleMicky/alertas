import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NotificationRequestStatus } from 'src/domain/enums';
import { NotificationRequestEntity } from './notification-request.entity';

@Entity({ name: 'tnotification_request_audits' })
@Index(['notificationRequestId'])
export class NotificationRequestAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'notification_request_id' })
  notificationRequestId: string;

  @ManyToOne(() => NotificationRequestEntity, { nullable: false })
  @JoinColumn({ name: 'notification_request_id' })
  notificationRequest: NotificationRequestEntity;

  @Column({
    name: 'from_status',
    type: 'enum',
    enum: NotificationRequestStatus,
    nullable: true,
  })
  fromStatus: NotificationRequestStatus | null;

  @Column({ name: 'to_status', type: 'enum', enum: NotificationRequestStatus })
  toStatus: NotificationRequestStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  reason: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({ name: 'changed_by', type: 'varchar', length: 100, nullable: true })
  changedBy: string | null;

  @CreateDateColumn({ name: 'changed_at', type: 'timestamp' })
  changedAt: Date;
}
