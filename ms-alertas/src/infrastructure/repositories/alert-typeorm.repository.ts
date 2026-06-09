import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { AlertStatus } from 'src/domain/enums/alert-status.enum';
import { AlertRepository } from 'src/domain/repositories/alert.repository';
import { AlertEntity } from '../typeorm/entities/alert.entity';

type AlertPersistenceInput = Partial<AlertEntity> & {
  eventId?: string;
  alertRuleId?: string;
  severityLevelId?: string;
  alertDate?: Date | string;
  attendedAt?: Date | string;
};

@Injectable()
export class AlertTypeormRepository
  extends GenericRepository<AlertEntity>
  implements AlertRepository
{
  private static readonly relations = {
    event: true,
    alertRule: true,
    severityLevel: true,
  };

  constructor(
    @InjectRepository(AlertEntity)
    repository: Repository<AlertEntity>,
  ) {
    super(repository);
  }

  findAll(): Promise<AlertEntity[]> {
    return this.repository.find({
      relations: AlertTypeormRepository.relations,
    });
  }

  findOne(id: string): Promise<AlertEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: AlertTypeormRepository.relations,
    });
  }

  findByEventId(eventId: string): Promise<AlertEntity[]> {
    return this.repository.find({
      where: { event: { id: eventId } },
      relations: AlertTypeormRepository.relations,
    });
  }

  findByStatus(status: string): Promise<AlertEntity[]> {
    return this.repository.find({
      where: { status: status as AlertStatus },
      relations: AlertTypeormRepository.relations,
    });
  }

  async create(entity: AlertPersistenceInput): Promise<AlertEntity> {
    const persistence = this.toPersistence(entity, true);

    const newEntity = this.repository.create(persistence);

    const saved = await this.repository.save(newEntity);

    return (await this.findOne(saved.id))!;
  }

  async update(
    id: string,
    entity: AlertPersistenceInput,
  ): Promise<AlertEntity> {
    const persistence = this.toPersistence(entity);

    await this.repository.update(id, persistence);

    const updated = await this.findOne(id);

    if (!updated) {
      throw new Error('Registro no encontrado');
    }

    return updated;
  }

  private toPersistence(
    entity: AlertPersistenceInput,
    applyDefaults = false,
  ): DeepPartial<AlertEntity> {
    const {
      eventId,
      alertRuleId,
      severityLevelId,
      alertDate,
      attendedAt,
      ...rest
    } = entity;

    return {
      ...rest,
      ...(eventId && { event: { id: eventId } }),
      ...(alertRuleId && { alertRule: { id: alertRuleId } }),
      ...(severityLevelId && {
        severityLevel: { id: severityLevelId },
      }),
      ...(alertDate !== undefined && {
        alertDate: alertDate instanceof Date ? alertDate : new Date(alertDate),
      }),
      ...(attendedAt !== undefined && {
        attendedAt:
          attendedAt instanceof Date ? attendedAt : new Date(attendedAt),
      }),
      ...(applyDefaults && {
        status: rest.status ?? AlertStatus.OPEN,
        active: rest.active ?? true,
      }),
    };
  }
}
