import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { SystemNotificationEntity } from './system-notification.entity';

@Entity({ name: 'tsystem_notification_reads' })
@Unique(['systemNotificationId', 'userId'])
@Index(['userId'])
export class SystemNotificationReadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'system_notification_id' })
  systemNotificationId: string;

  @ManyToOne(() => SystemNotificationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'system_notification_id' })
  systemNotification: SystemNotificationEntity;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @CreateDateColumn({ name: 'read_at', type: 'timestamp' })
  readAt: Date;
}
