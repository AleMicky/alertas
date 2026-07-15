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

  @Column({ name: 'client_system_id' })
  clientSystemId: string;

  @ManyToOne(() => ClientSystemEntity)
  @JoinColumn({ name: 'client_system_id' })
  clientSystem: ClientSystemEntity;

  @Column({ unique: true, name: 'token_hash' })
  tokenHash: string;

  @Column({ name: 'expires_at', type: 'date' })
  expiresAt: Date;
}
