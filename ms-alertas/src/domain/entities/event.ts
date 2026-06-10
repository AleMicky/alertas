import { ClientSystem } from './client-system';
import { EventType } from './event-type';
import { EventStatus } from '../enums/event-status.enum';

export class Event {
  id: string;
  clientSystem: ClientSystem;
  eventType: EventType;
  payloadJson?: Record<string, unknown>;
  createdAt: Date;
  status: EventStatus;
  processedAt?: Date;
}
 