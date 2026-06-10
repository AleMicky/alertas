import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { EventRepository } from 'src/domain/repositories/event.repository';
import { EventStatus } from 'src/domain/enums/event-status.enum';
import { EventEntity } from '../typeorm/entities/event.entity';

type EventPersistenceInput = Partial<EventEntity> & {
  clientSystemId: string;
  eventTypeId: string;
};

@Injectable()
export class EventTypeormRepository
  extends GenericRepository<EventEntity>
  implements EventRepository
{
  private readonly relations = {
    clientSystem: true,
    eventType: true,
  };

  constructor(
    @InjectRepository(EventEntity)
    repository: Repository<EventEntity>,
  ) {
    super(repository);
  }

  findOne(id: string): Promise<EventEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  findByClientSystemId(clientSystemId: string): Promise<EventEntity[]> {
    return this.repository.find({
      where: {
        clientSystem: { id: clientSystemId },
      },
      relations: this.relations,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(entity: EventPersistenceInput): Promise<EventEntity> {
    const newEntity = this.repository.create(
      this.toPersistence(entity, true),
    );

    const saved = await this.repository.save(newEntity);

    const event = await this.findOne(saved.id);

    if (!event) {
      throw new NotFoundException('Evento creado, pero no encontrado');
    }

    return event;
  }

  async update(
    id: string,
    entity: EventPersistenceInput,
  ): Promise<EventEntity> {
    const exists = await this.findOne(id);

    if (!exists) {
      throw new NotFoundException('Evento no encontrado');
    }

    await this.repository.update(id, this.toPersistence(entity));

    const updated = await this.findOne(id);

    if (!updated) {
      throw new NotFoundException('Evento no encontrado');
    }

    return updated;
  }

  private toPersistence(
    entity: EventPersistenceInput,
    applyDefaults = false,
  ): DeepPartial<EventEntity> {
    const { clientSystemId, eventTypeId, ...rest } = entity;

    return {
      ...rest,

      ...(clientSystemId && {
        clientSystem: {
          id: clientSystemId,
        },
      }),

      ...(eventTypeId && {
        eventType: {
          id: eventTypeId,
        },
      }),

      ...(applyDefaults && {
        status: rest.status ?? EventStatus.PENDING,
        createdAt: rest.createdAt ?? new Date(),
      }),
    };
  }
}
