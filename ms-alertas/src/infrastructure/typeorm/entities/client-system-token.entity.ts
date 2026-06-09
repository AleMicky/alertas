import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientSystemEntity } from './client-system.entity';
import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';

@Entity({ name: 'tclient_system_tokens' })
export class ClientSystemTokenEntity extends BaseAuditColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClientSystemEntity)
  @JoinColumn({ name: 'client_system_id' })
  clientSystem: ClientSystemEntity;

  @Column({ unique: true, name: 'token_hash' })
  tokenHash: string;

  @Column({
    nullable: true,
    length: 300,
  })
  description?: string;

  @Column({
    name: 'expires_at',
    nullable: true,
    type: 'timestamp',
  })
  expiresAt?: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastUsedAt?: Date;

  @Column({ default: true })
  active: boolean;
}
