import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EventStatus } from 'src/domain/enums/event-status.enum';
import { ClientSystemEntity } from './client-system.entity';
import { EventTypeEntity } from './event-type.entity';

@Entity('tevents')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClientSystemEntity)
  @JoinColumn({ name: 'client_system_id' })
  clientSystem: ClientSystemEntity;

  @ManyToOne(() => EventTypeEntity)
  @JoinColumn({ name: 'event_type_id' })
  eventType: EventTypeEntity;

  @Column({ name: 'payload_json', type: 'jsonb', nullable: true })
  payloadJson?: Record<string, any>;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ length: 50, default: EventStatus.PENDING })
  status: EventStatus;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt?: Date;
}
