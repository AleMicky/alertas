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
  NotificationRecipientStatus,
  NotificationRecipientType,
} from 'src/domain/enums';
import { NotificationRequestEntity } from './notification-request.entity';

@Entity({ name: 'tnotification_recipients' })
@Index(['notificationRequestId'])
export class NotificationRecipientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'notification_request_id' })
  notificationRequestId: string;

  @ManyToOne(() => NotificationRequestEntity, { nullable: false })
  @JoinColumn({ name: 'notification_request_id' })
  notificationRequest: NotificationRequestEntity;

  @Column({ type: 'enum', enum: NotificationRecipientType })
  type: NotificationRecipientType;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label: string | null;

  @Column({
    type: 'enum',
    enum: NotificationRecipientStatus,
    default: NotificationRecipientStatus.PENDING,
  })
  status: NotificationRecipientStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
