import { BaseAuditableEntity } from 'src/shared/core/base-auditable-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('troles')
export class RoleEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 100 })
  name: string;
}