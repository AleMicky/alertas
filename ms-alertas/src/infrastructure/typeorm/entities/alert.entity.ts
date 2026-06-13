import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

 
import { AlertStatus } from 'src/domain/enums/alert-status.enum';
 
import { EventEntity } from './event.entity';

@Entity('talerts')
export class AlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventEntity)
  @JoinColumn({
    name: 'event_id',
  })
  event: EventEntity;

  @Column({
    length: 50,
    default: AlertStatus.OPEN,
  })
  status: AlertStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'notified_at',
    type: 'timestamp',
    nullable: true,
  })
  notifiedAt?: Date | null;

  @Column({
    name: 'failed_at',
    type: 'timestamp',
    nullable: true,
  })
  failedAt?: Date | null;


}
