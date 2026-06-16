import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { NotificationProvider } from 'src/domain/entities';
import { NotificationProviderRepository } from 'src/domain/repositories/notification-provider.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationProviderEntity } from '../typeorm/entities/notification-provider.entity';

type NotificationProviderPersistenceInput = Partial<NotificationProviderEntity> & {
  clientSystemId?: string;
  notificationChannelId?: string;
};

@Injectable()
export class NotificationProviderTypeormRepository
  extends GenericRepository<NotificationProviderEntity>
  implements NotificationProviderRepository
{
  private static readonly relations = {
    clientSystem: true,
    notificationChannel: true,
  };

  constructor(
    @InjectRepository(NotificationProviderEntity)
    repository: Repository<NotificationProviderEntity>,
  ) {
    super(repository);
  }

  findAll(): Promise<NotificationProviderEntity[]> {
    return this.repository.find({
      relations: NotificationProviderTypeormRepository.relations,
    });
  }

  findOne(id: string): Promise<NotificationProviderEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: NotificationProviderTypeormRepository.relations,
    });
  }

  findByCode(code: string): Promise<NotificationProvider | null> {
    return this.repository.findOne({
      where: { code },
      relations: NotificationProviderTypeormRepository.relations,
    });
  }

  findByNotificationChannelId(
    notificationChannelId: string,
  ): Promise<NotificationProvider[]> {
    return this.repository.find({
      where: {
        notificationChannel: { id: notificationChannelId },
      },
      relations: NotificationProviderTypeormRepository.relations,
    });
  }

  findByClientSystemId(clientSystemId: string): Promise<NotificationProvider[]> {
    return this.repository.find({
      where: {
        clientSystem: { id: clientSystemId },
      },
      relations: NotificationProviderTypeormRepository.relations,
    });
  }

  async create(
    entity: NotificationProviderPersistenceInput,
  ): Promise<NotificationProviderEntity> {
    const persistence = this.toPersistence(entity, true);
    const newEntity = this.repository.create(persistence);
    const saved = await this.repository.save(newEntity);
    return (await this.findOne(saved.id))!;
  }

  async update(
    id: string,
    entity: NotificationProviderPersistenceInput,
  ): Promise<NotificationProviderEntity> {
    const persistence = this.toPersistence(entity);
    const existing = await this.findOne(id);
    if (!existing) {
      throw new Error('Registro no encontrado');
    }
    await this.repository.save(
      this.repository.merge(existing, this.toPersistence(entity)),
    );
    const updated = await this.findOne(id);

    if (!updated) {
      throw new Error('Registro no encontrado');
    }

    return updated;
  }

  private toPersistence(
    entity: NotificationProviderPersistenceInput,
    applyDefaults = false,
  ): DeepPartial<NotificationProviderEntity> {
    const { clientSystemId, notificationChannelId, ...rest } = entity;

    return {
      ...rest,
      ...(clientSystemId && {
        clientSystem: { id: clientSystemId },
      }),
      ...(notificationChannelId && {
        notificationChannel: { id: notificationChannelId },
      }),
      ...(applyDefaults && {
        active: rest.active ?? true,
      }),
    };
  }
}
