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
}
