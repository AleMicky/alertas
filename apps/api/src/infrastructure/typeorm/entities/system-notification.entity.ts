import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SystemNotificationType } from 'src/domain/enums';

@Entity({ name: 'tsystem_notifications' })
@Index(['createdAt'])
@Index(['notificationRequestId'])
export class SystemNotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SystemNotificationType,
  })
  type: SystemNotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  href: string | null;

  @Column({
    name: 'notification_request_id',
    type: 'uuid',
    nullable: true,
  })
  notificationRequestId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
