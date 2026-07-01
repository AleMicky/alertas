class ClientSystem {
  id: string;
  code: string;
  name: string;
}

export class ResponseEventDto {
  id: string;
  clientSystem: ClientSystem;
  eventTypeCode: string;
  payloadJson?: Record<string, unknown>;
  status: string;
  createdAt: string;
  processedAt?: string;
}
