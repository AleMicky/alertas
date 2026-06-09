import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/shared/core/base.service';
import { EventType } from 'src/domain/entities/event-type';
import { EventTypeRepository } from 'src/domain/repositories/event-type.repository';

@Injectable()
export class EventTypeService extends BaseService<EventType> {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {
    super(eventTypeRepository);
  }

  findByCode(clientSystemId: string, code: string) {
    return this.eventTypeRepository.findByCode(clientSystemId, code);
  }

  findActiveByClientSystem(clientSystemId: string) {
    return this.eventTypeRepository.findActiveByClientSystem(clientSystemId);
  }
}
