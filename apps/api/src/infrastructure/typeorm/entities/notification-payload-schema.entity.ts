import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';
import { NotificationChannelEntity } from './notification-channel.entity';

@Entity({ name: 'tnotification_payload_schemas' })
@Index(['notificationChannelId', 'version'], { unique: true })
export class NotificationPayloadSchemaEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'notification_channel_id' })
  notificationChannelId: string;

  @ManyToOne(() => NotificationChannelEntity, { nullable: false })
  @JoinColumn({ name: 'notification_channel_id' })
  notificationChannel: NotificationChannelEntity;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  version: number;

  @Column({ name: 'schema_json', type: 'jsonb' })
  schemaJson: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  example: Record<string, unknown> | null;

  @Column({ name: 'required_fields', type: 'jsonb', default: [] })
  requiredFields: string[];
}
