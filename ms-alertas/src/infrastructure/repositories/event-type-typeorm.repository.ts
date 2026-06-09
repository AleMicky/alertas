import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { EventTypeEntity } from '../typeorm/entities/event-type.entity';
import { EventTypeRepository } from 'src/domain/repositories/event-type.repository';
import { EventType } from 'src/domain/entities';

type EventTypePersistenceInput = Partial<EventTypeEntity> & {
  clientSystemId?: string;
  severityLevelId?: string;
};

@Injectable()
export class EventTypeTypeormRepository
  extends GenericRepository<EventTypeEntity>
  implements EventTypeRepository
{
  private static readonly relations = {
    clientSystem: true,
    severityLevel: true,
  };

  constructor(
    @InjectRepository(EventTypeEntity)
    repository: Repository<EventTypeEntity>,
  ) {
    super(repository);
  }

  findAll(): Promise<EventTypeEntity[]> {
    return this.repository.find({
      relations: EventTypeTypeormRepository.relations,
    });
  }

  findOne(id: string): Promise<EventTypeEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: EventTypeTypeormRepository.relations,
    });
  }

  findByCode(clientSystemId: string, code: string): Promise<EventType | null> {
    return this.repository.findOne({
      where: { code, clientSystem: { id: clientSystemId } },
      relations: EventTypeTypeormRepository.relations,
    });
  }

  findActiveByClientSystem(clientSystemId: string): Promise<EventType[]> {
    return this.repository.find({
      where: {
        clientSystem: { id: clientSystemId },
        active: true,
      },
      relations: EventTypeTypeormRepository.relations,
    });
  }

  async create(entity: EventTypePersistenceInput): Promise<EventTypeEntity> {
    const persistence = this.toPersistence(entity, true);
    const newEntity = this.repository.create(persistence);
    const saved = await this.repository.save(newEntity);
    return (await this.findOne(saved.id))!;
  }

  async update(
    id: string,
    entity: EventTypePersistenceInput,
  ): Promise<EventTypeEntity> {
    const persistence = this.toPersistence(entity);
    await this.repository.update(id, persistence);
    const updated = await this.findOne(id);

    if (!updated) {
      throw new Error('Registro no encontrado');
    }

    return updated;
  }

  private toPersistence(
    entity: EventTypePersistenceInput,
    applyDefaults = false,
  ): DeepPartial<EventTypeEntity> {
    const { clientSystemId, severityLevelId, ...rest } = entity;

    return {
      ...rest,
      ...(clientSystemId && {
        clientSystem: { id: clientSystemId },
      }),
      ...(severityLevelId && {
        severityLevel: { id: severityLevelId },
      }),
      ...(applyDefaults && {
        active: rest.active ?? true,
      }),
    };
  }
}
