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
import { UserEntity } from './user.entity';

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

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'read_at', type: 'timestamp' })
  readAt: Date;
}
