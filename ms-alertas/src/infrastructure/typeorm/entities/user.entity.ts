import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseAuditColumns } from 'src/shared/core/base-audit-columns';
import { RoleEntity } from './role.entity';

@Entity('tusers')
export class UserEntity extends BaseAuditColumns {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, unique: true })
    username: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ name: 'password_hash', length: 255 })
    passwordHash: string;

    @Column({ name: 'full_name', length: 200 })
    fullName: string;

    @ManyToMany(() => RoleEntity)
    @JoinTable({
        name: 'tuser_roles',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'role_id' },
    })
    roles: RoleEntity[];
}