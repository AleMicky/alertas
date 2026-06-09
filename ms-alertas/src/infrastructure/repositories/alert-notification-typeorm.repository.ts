import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';
import { AlertNotificationRepository } from 'src/domain/repositories/alert-notification.repository';
import { AlertNotificationEntity } from '../typeorm/entities/alert-notification.entity';

type AlertNotificationPersistenceInput = Partial<AlertNotificationEntity> & {
  alertId?: string;
  notificationChannelId?: string;
  sentAt?: Date | string;
};

@Injectable()
export class AlertNotificationTypeormRepository
  extends GenericRepository<AlertNotificationEntity>
  implements AlertNotificationRepository
{
  private static readonly relations = {
    alert: {
      event: {
        clientSystem: true,
      },
      severityLevel: true,
    },
    notificationChannel: true,
  };

  constructor(
    @InjectRepository(AlertNotificationEntity)
    repository: Repository<AlertNotificationEntity>,
  ) {
    super(repository);
  }

  findAll(): Promise<AlertNotificationEntity[]> {
    return this.repository.find({
      relations: AlertNotificationTypeormRepository.relations,
    });
  }

  findOne(id: string): Promise<AlertNotificationEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: AlertNotificationTypeormRepository.relations,
    });
  }

  findByAlertId(alertId: string): Promise<AlertNotificationEntity[]> {
    return this.repository.find({
      where: { alert: { id: alertId } },
      relations: AlertNotificationTypeormRepository.relations,
    });
  }

  findByStatus(status: string): Promise<AlertNotificationEntity[]> {
    return this.repository.find({
      where: { status: status as AlertNotificationStatus },
      relations: AlertNotificationTypeormRepository.relations,
    });
  }

  async create(
    entity: AlertNotificationPersistenceInput,
  ): Promise<AlertNotificationEntity> {
    const persistence = this.toPersistence(entity, true);

    const newEntity = this.repository.create(persistence);

    const saved = await this.repository.save(newEntity);

    return (await this.findOne(saved.id))!;
  }

  async update(
    id: string,
    entity: AlertNotificationPersistenceInput,
  ): Promise<AlertNotificationEntity> {
    const persistence = this.toPersistence(entity);

    await this.repository.update(id, persistence);

    const updated = await this.findOne(id);

    if (!updated) {
      throw new Error('Registro no encontrado');
    }

    return updated;
  }

  private toPersistence(
    entity: AlertNotificationPersistenceInput,
    applyDefaults = false,
  ): DeepPartial<AlertNotificationEntity> {
    const { alertId, notificationChannelId, sentAt, ...rest } = entity;

    return {
      ...rest,
      ...(alertId && { alert: { id: alertId } }),
      ...(notificationChannelId && {
        notificationChannel: { id: notificationChannelId },
      }),
      ...(sentAt !== undefined && {
        sentAt: sentAt instanceof Date ? sentAt : new Date(sentAt),
      }),
      ...(applyDefaults && {
        status: rest.status ?? AlertNotificationStatus.PENDING,
      }),
    };
  }
}
