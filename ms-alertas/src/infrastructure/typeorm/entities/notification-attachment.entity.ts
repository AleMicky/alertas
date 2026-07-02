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

import { NotificationRequestEntity } from './notification-request.entity';

@Entity({ name: 'tnotification_attachments' })
@Index(['notificationRequestId'])
export class NotificationAttachmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'notification_request_id' })
  notificationRequestId: string;

  @ManyToOne(() => NotificationRequestEntity, { nullable: false })
  @JoinColumn({ name: 'notification_request_id' })
  notificationRequest: NotificationRequestEntity;

  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 2000 })
  url: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 150 })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint' })
  sizeBytes: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  checksum: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
