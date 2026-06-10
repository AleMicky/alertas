import { BaseRepository } from 'src/shared/core/base.repository';
import { Event } from '../entities/event';

export abstract class EventRepository extends BaseRepository<Event> {
  abstract findByClientSystemId(clientSystemId: string): Promise<Event[]>;
}
