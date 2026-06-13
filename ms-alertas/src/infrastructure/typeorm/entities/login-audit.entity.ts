import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tlogin_audits')
export class LoginAuditEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    username?: string | null;

    @Column({ name: 'ip_address', type: 'varchar', length: 100, nullable: true })
    ipAddress?: string | null;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent?: string | null;

    @Column({ default: false })
    success: boolean;

    @Column({ name: 'failure_reason', type: 'text', nullable: true })
    failureReason?: string | null;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}