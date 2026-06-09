import { BaseRepository } from 'src/shared/core/base.repository';
import { Event } from '../entities/event';

export abstract class EventRepository extends BaseRepository<Event> {
  abstract findByCode(code: string): Promise<Event | null>;

  abstract findByClientSystemId(clientSystemId: string): Promise<Event[]>;
}
