import { ClientSystem } from './client-system';
import { EventStatus } from '../enums/event-status.enum';

export class Event {
  id: string;
  clientSystem: ClientSystem;
  eventTypeCode: string;
  payloadJson?: Record<string, unknown>;
  createdAt: Date;
  status: EventStatus;
  processedAt?: Date;
}
 