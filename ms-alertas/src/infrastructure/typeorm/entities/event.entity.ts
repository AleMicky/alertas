import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';

import { EventStatus } from 'src/domain/enums/event-status.enum';

import { ClientSystemEntity } from './client-system.entity';

@Entity('tevents')
export class EventEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClientSystemEntity)
  @JoinColumn({ name: 'client_system_id' })
  clientSystem: ClientSystemEntity;

  @Column({ unique: true, length: 100 })
  code: string;

  @Column({ name: 'event_type', length: 100 })
  eventType: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'payload_json', type: 'jsonb', nullable: true })
  payloadJson?: Record<string, any>;

  @Column({ length: 50, default: EventStatus.PENDING })
  status: EventStatus;

  @Column({ name: 'event_date', type: 'timestamp' })
  eventDate: Date;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;

  @Column({ default: true })
  active: boolean;
}
