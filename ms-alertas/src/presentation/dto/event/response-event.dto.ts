class ClientSystem {
  id: string;
  code: string;
  name: string;
}

class EventType {
  id: string;
  code: string;
  name: string;
}

export class ResponseEventDto {
  id: string;
  clientSystem: ClientSystem;
  eventType: EventType;
  payloadJson?: Record<string, unknown>;
  status: string;
  createdAt: string;
  processedAt?: string;
}
