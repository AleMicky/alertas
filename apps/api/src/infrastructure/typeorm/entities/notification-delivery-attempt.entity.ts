import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NotificationDeliveryStatus } from 'src/domain/enums';
import { NotificationDeliveryEntity } from './notification-delivery.entity';

@Entity({ name: 'tnotification_delivery_attempts' })
@Index(['notificationDeliveryId'])
export class NotificationDeliveryAttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'notification_delivery_id' })
  notificationDeliveryId: string;

  @ManyToOne(() => NotificationDeliveryEntity, { nullable: false })
  @JoinColumn({ name: 'notification_delivery_id' })
  notificationDelivery: NotificationDeliveryEntity;

  @Column({ name: 'attempt_number', type: 'int' })
  attemptNumber: number;

  @Column({ type: 'enum', enum: NotificationDeliveryStatus })
  status: NotificationDeliveryStatus;

  @Column({ name: 'request_payload', type: 'jsonb', nullable: true })
  requestPayload: Record<string, unknown> | null;

  @Column({ name: 'response_payload', type: 'jsonb', nullable: true })
  responsePayload: Record<string, unknown> | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'attempted_at', type: 'timestamp' })
  attemptedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
