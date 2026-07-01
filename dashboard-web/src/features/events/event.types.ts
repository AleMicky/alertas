import { ClientSystem } from '../client-systems/types/client-system.types';

export interface Event {
  id: string;
  clientSystem: ClientSystem;
  eventTypeCode: string;
  payloadJson?: Record<string, unknown>;
  /** Alias que puede enviar la API en snake_case */
  payload_json?: Record<string, unknown>;
  status: string;
  createdAt: string;
  processedAt?: string;
}
