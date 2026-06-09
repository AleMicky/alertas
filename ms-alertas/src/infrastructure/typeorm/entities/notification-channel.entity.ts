import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';
import { NotificationChannelType } from 'src/domain/enums/notification-channel-type.enum';

@Entity({ name: 'tnotification_channels' })
export class NotificationChannelEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: NotificationChannelType,
  })
  type: NotificationChannelType;

  @Column({ name: 'webhook_url', type: 'text' })
  webhookUrl: string;

  @Column({ nullable: true, length: 500 })
  description?: string;

  @Column({ default: true })
  active: boolean;
}
