import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { AlertRuleRepository } from 'src/domain/repositories/alert-rule.repository';
import { AlertRuleEntity } from '../typeorm/entities/alert-rule.entity';

type AlertRulePersistenceInput = Partial<AlertRuleEntity> & {
  severityLevelId?: string;
  notificationChannelId?: string;
};

@Injectable()
export class AlertRuleTypeormRepository
  extends GenericRepository<AlertRuleEntity>
  implements AlertRuleRepository
{
  private static readonly relations = {
    severityLevel: true,
    notificationChannel: true,
  };

  constructor(
    @InjectRepository(AlertRuleEntity)
    repository: Repository<AlertRuleEntity>,
  ) {
    super(repository);
  }

  findAll(): Promise<AlertRuleEntity[]> {
    return this.repository.find({
      relations: AlertRuleTypeormRepository.relations,
    });
  }

  findOne(id: string): Promise<AlertRuleEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: AlertRuleTypeormRepository.relations,
    });
  }

  findByCode(code: string): Promise<AlertRuleEntity | null> {
    return this.repository.findOne({
      where: { code },
      relations: AlertRuleTypeormRepository.relations,
    });
  }

  findByEventType(eventType: string): Promise<AlertRuleEntity[]> {
    return this.repository.find({
      where: { eventType },
      relations: AlertRuleTypeormRepository.relations,
    });
  }

  async create(entity: AlertRulePersistenceInput): Promise<AlertRuleEntity> {
    const persistence = this.toPersistence(entity, true);

    const newEntity = this.repository.create(persistence);

    const saved = await this.repository.save(newEntity);

    return (await this.findOne(saved.id))!;
  }

  async update(
    id: string,
    entity: AlertRulePersistenceInput,
  ): Promise<AlertRuleEntity> {
    const persistence = this.toPersistence(entity);

    await this.repository.update(id, persistence);

    const updated = await this.findOne(id);

    if (!updated) {
      throw new Error('Registro no encontrado');
    }

    return updated;
  }

  private toPersistence(
    entity: AlertRulePersistenceInput,
    applyDefaults = false,
  ): DeepPartial<AlertRuleEntity> {
    const { severityLevelId, notificationChannelId, ...rest } = entity;

    return {
      ...rest,
      ...(severityLevelId && {
        severityLevel: { id: severityLevelId },
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
