import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GenericRepository } from 'src/shared/core/generic.repository';
import { AlertNotificationStatus } from 'src/domain/enums/alert-notification-status.enum';
import {
  AlertNotificationRepository,
  AlertNotificationStats,
} from 'src/domain/repositories/alert-notification.repository';
import { AlertNotificationEntity } from '../typeorm/entities/alert-notification.entity';
 
type AlertNotificationPersistenceInput = Partial<AlertNotificationEntity> & {
  alertId?: string;
  notificationChannelId?: string;
  sentAt?: Date | string;
};

@Injectable()
export class AlertNotificationTypeormRepository
  extends GenericRepository<AlertNotificationEntity>
  implements AlertNotificationRepository {
  private static readonly relations = {
    alert: {
      event: {
        clientSystem: true,
        eventType: true,
      },
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
      order: {
        createdAt: 'DESC',
      },
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
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async countStatsByAlertIds(
    alertIds: string[],
  ): Promise<Record<string, AlertNotificationStats>> {
    if (alertIds.length === 0) {
      return {};
    }

    const rows = await this.repository
      .createQueryBuilder('notification')
      .innerJoin('notification.alert', 'alert')
      .select('alert.id', 'alertId')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        `SUM(CASE WHEN notification.status = :sent THEN 1 ELSE 0 END)`,
        'sent',
      )
      .addSelect(
        `SUM(CASE WHEN notification.status = :failed THEN 1 ELSE 0 END)`,
        'failed',
      )
      .addSelect(
        `SUM(CASE WHEN notification.status IN ('PENDING', 'PROCESSING') THEN 1 ELSE 0 END)`,
        'pending',
      )
      .where('alert.id IN (:...alertIds)', { alertIds })
      .setParameters({
        sent: AlertNotificationStatus.SENT,
        failed: AlertNotificationStatus.FAILED,
      })
      .groupBy('alert.id')
      .getRawMany<{
        alertId: string;
        total: string;
        sent: string;
        failed: string;
        pending: string;
      }>();

    return Object.fromEntries(
      rows.map((row) => [
        row.alertId,
        {
          total: Number(row.total) || 0,
          sent: Number(row.sent) || 0,
          failed: Number(row.failed) || 0,
          pending: Number(row.pending) || 0,
        },
      ]),
    );
  }

  async create(entity: AlertNotificationPersistenceInput): Promise<AlertNotificationEntity> {
    
    const persistence = this.toPersistence(entity, true);
    const newEntity = this.repository.create(persistence);
    const saved = await this.repository.save(newEntity);

    return (await this.findOne(saved.id))!;
  }


  async update(
    id: string,
    entity: AlertNotificationPersistenceInput,
  ): Promise<AlertNotificationEntity> {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new NotFoundException('Registro no encontrado');
    }

    await this.repository.save(
      this.repository.merge(existing, this.toPersistence(entity)),
    );

    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException('Registro no encontrado');
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
