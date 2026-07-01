import { Injectable } from '@nestjs/common';

import { Event } from 'src/domain/entities/event';
import { EventStatus } from 'src/domain/enums/event-status.enum';
import { BaseMapper } from 'src/shared/core/base.mapper';
import {
  CreateEventDto,
  UpdateEventDto,
} from 'src/presentation/dto/event';
import { ResponseEventDto } from 'src/presentation/dto/event/response-event.dto';
 
@Injectable()
export class EventMapper extends BaseMapper<
  Event,
  ResponseEventDto,
  CreateEventDto,
  UpdateEventDto
> {
  toResponse(entity: Event): ResponseEventDto {
    return {
      id: entity.id,
      clientSystem: {
        id: entity.clientSystem.id,
        code: entity.clientSystem.code,
        name: entity.clientSystem.name,
      },
      eventTypeCode: entity.eventTypeCode,
      payloadJson: entity.payloadJson,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      processedAt: entity.processedAt?.toISOString(),
    };
  }

  fromCreateDto(dto: CreateEventDto): Partial<Event> {
    return {
      eventTypeCode: dto.eventTypeCode,
      payloadJson: dto.payloadJson,
      status: EventStatus.PENDING,
    };
  }

  fromUpdateDto(dto: UpdateEventDto): Partial<Event> {
    return {
      ...(dto.payloadJson !== undefined && { payloadJson: dto.payloadJson }),
    };
  }
}
