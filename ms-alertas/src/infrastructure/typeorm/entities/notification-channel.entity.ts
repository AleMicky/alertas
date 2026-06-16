import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';
 
@Entity({ name: 'tnotification_channels' })
export class NotificationChannelEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'webhook_url', type: 'text' })
  webhookUrl: string;

  @Column({ nullable: true, length: 500 })
  description?: string;

  @Column({ name: 'payload_schema_json', type: 'jsonb', nullable: true })
  payloadSchemaJson?: Record<string, unknown>;

  @Column({ name: 'payload_body_json', type: 'jsonb', nullable: true })
  payloadBodyJson?: Record<string, unknown>;
}
