import { BaseRepository } from 'src/shared/core/base.repository';
import { Alert } from '../entities/alert';

export abstract class AlertRepository extends BaseRepository<Alert> {
  abstract findByEventId(eventId: string): Promise<Alert[]>;

  abstract findByStatus(status: string): Promise<Alert[]>;
}
