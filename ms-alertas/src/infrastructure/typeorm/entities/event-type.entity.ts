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
import { SeverityLevelEntity } from './severity-level.entity';

@Entity('tevent_types')
@Unique('uq_event_type_client_system_code', ['clientSystem', 'code'])
export class EventTypeEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClientSystemEntity, { nullable: false })
  @JoinColumn({ name: 'client_system_id' })
  clientSystem: ClientSystemEntity;

  @Column({ length: 100 })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => SeverityLevelEntity, { nullable: true })
  @JoinColumn({ name: 'severity_level_id' })
  severityLevel?: SeverityLevelEntity;

  @Column({ default: true })
  active: boolean;
}
