import { BaseRepository } from 'src/shared/core/base.repository';
import { EventType } from '../entities/event-type';

export abstract class EventTypeRepository extends BaseRepository<EventType> {
  abstract findByCode(
    clientSystemId: string,
    code: string,
  ): Promise<EventType | null>;
  abstract findActiveByClientSystem(
    clientSystemId: string,
  ): Promise<EventType[]>;
}
