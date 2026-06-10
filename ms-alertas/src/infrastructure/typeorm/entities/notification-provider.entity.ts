import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';

import { ClientSystemEntity } from './client-system.entity';
import { NotificationChannelEntity } from './notification-channel.entity';

@Entity({ name: 'tnotification_providers' })
@Unique('uq_provider_system_channel_code', [
  'clientSystem',
  'notificationChannel',
  'code',
])
export class NotificationProviderEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_system_id' })
  clientSystemId: string;

  @ManyToOne(() => ClientSystemEntity, { nullable: false })
  @JoinColumn({ name: 'client_system_id' })
  clientSystem: ClientSystemEntity;

  @Column({ name: 'notification_channel_id' })
  notificationChannelId: string;

  @ManyToOne(() => NotificationChannelEntity, { nullable: false })
  @JoinColumn({ name: 'notification_channel_id' })
  notificationChannel: NotificationChannelEntity;

  @Column({ length: 100 })
  code: string;

  @Column({ length: 200 })
  name: string;
}
