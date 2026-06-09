import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { EventRepository } from 'src/domain/repositories/event.repository';
import { EventStatus } from 'src/domain/enums/event-status.enum';
import { EventEntity } from '../typeorm/entities/event.entity';

type EventPersistenceInput = Partial<EventEntity> & {
  clientSystemId?: string;
  severityLevelId?: string;
  eventDate?: Date | string;
};

@Injectable()
export class EventTypeormRepository
  extends GenericRepository<EventEntity>
  implements EventRepository
{
  private static readonly relations = {
    clientSystem: true,
  };

  constructor(
    @InjectRepository(EventEntity)
    repository: Repository<EventEntity>,
  ) {
    super(repository);
  }

  findAll(): Promise<EventEntity[]> {
    return this.repository.find({
      relations: EventTypeormRepository.relations,
    });
  }

  findOne(id: string): Promise<EventEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: EventTypeormRepository.relations,
    });
  }

  findByCode(code: string): Promise<EventEntity | null> {
    return this.repository.findOne({
      where: { code },
      relations: EventTypeormRepository.relations,
    });
  }

  findByClientSystemId(clientSystemId: string): Promise<EventEntity[]> {
    return this.repository.find({
      where: {
        clientSystem: { id: clientSystemId },
      },
      relations: EventTypeormRepository.relations,
    });
  }

  async create(entity: EventPersistenceInput): Promise<EventEntity> {
    const persistence = this.toPersistence(entity, true);

    const newEntity = this.repository.create(persistence);

    const saved = await this.repository.save(newEntity);

    return (await this.findOne(saved.id))!;
  }

  async update(
    id: string,
    entity: EventPersistenceInput,
  ): Promise<EventEntity> {
    const persistence = this.toPersistence(entity);

    await this.repository.update(id, persistence);

    const updated = await this.findOne(id);

    if (!updated) {
      throw new Error('Registro no encontrado');
    }

    return updated;
  }

  private toPersistence(
    entity: EventPersistenceInput,
    applyDefaults = false,
  ): DeepPartial<EventEntity> {
    const { clientSystemId, severityLevelId, eventDate, ...rest } = entity;

    return {
      ...rest,
      ...(clientSystemId && {
        clientSystem: { id: clientSystemId },
      }),
      ...(eventDate !== undefined && {
        eventDate: eventDate instanceof Date ? eventDate : new Date(eventDate),
      }),
      ...(applyDefaults && {
        status: rest.status ?? EventStatus.PENDING,
        active: rest.active ?? true,
      }),
    };
  }
}
