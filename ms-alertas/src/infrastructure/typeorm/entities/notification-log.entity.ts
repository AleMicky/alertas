import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notification_logs')
export class NotificationLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'request_payload',
    type: 'jsonb',
  })
  requestPayload: Record<string, any>;

  @Column({
    name: 'response_payload',
    type: 'jsonb',
    nullable: true,
  })
  responsePayload?: Record<string, any>;

  @Column({
    name: 'status_code',
    nullable: true,
  })
  statusCode?: number;

  @Column({
    name: 'error_message',
    type: 'text',
    nullable: true,
  })
  errorMessage?: string;

  @Column({
    name: 'executed_at',
    type: 'timestamp',
  })
  executedAt: Date;
}
