import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { NotificationRequestData } from 'src/domain/entities/notification-request';
import { NotificationRequestRepository } from 'src/domain/repositories/notification-request.repository';
import {
  NotificationRequestSearchFilters,
  NotificationRequestSearchResult,
  NotificationRequestStats,
} from 'src/domain/types/notification-request-search.types';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationRequestEntity } from '../typeorm/entities/notification-request.entity';

@Injectable()
export class NotificationRequestTypeormRepository
  extends GenericRepository<NotificationRequestEntity>
  implements NotificationRequestRepository
{
  constructor(
    @InjectRepository(NotificationRequestEntity)
    repository: Repository<NotificationRequestEntity>,
  ) {
    super(repository);
  }

  findByClientSystemIdAndIdempotencyKey(
    clientSystemId: string,
    idempotencyKey: string,
  ) {
    return this.repository.findOne({
      where: { clientSystemId, idempotencyKey },
    });
  }

  findAllByClientSystemId(clientSystemId: string) {
    return this.repository.find({
      where: { clientSystemId, archivedAt: IsNull() },
      order: { requestedAt: 'DESC' },
    });
  }

  async search(
    filters: NotificationRequestSearchFilters,
  ): Promise<NotificationRequestSearchResult<NotificationRequestData>> {
    const page = Math.max(filters.page ?? 1, 1);
    const size = Math.min(Math.max(filters.size ?? 20, 1), 100);
    const qb = this.repository.createQueryBuilder('request');

    if (!filters.includeArchived) {
      qb.andWhere('request.archived_at IS NULL');
    }

    if (filters.status) {
      qb.andWhere('request.status = :status', { status: filters.status });
    }

    if (filters.clientSystemId) {
      qb.andWhere('request.client_system_id = :clientSystemId', {
        clientSystemId: filters.clientSystemId,
      });
    }

    if (filters.notificationChannelId) {
      qb.andWhere('request.notification_channel_id = :notificationChannelId', {
        notificationChannelId: filters.notificationChannelId,
      });
    }

    if (filters.channelCode) {
      qb.innerJoin('request.notificationChannel', 'channel');
      qb.andWhere('channel.code = :channelCode', {
        channelCode: filters.channelCode,
      });
    }

    if (filters.priority) {
      qb.andWhere('request.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters.externalReference) {
      qb.andWhere('request.external_reference = :externalReference', {
        externalReference: filters.externalReference,
      });
    }

    if (filters.correlationId) {
      qb.andWhere('request.correlation_id = :correlationId', {
        correlationId: filters.correlationId,
      });
    }

    if (filters.idempotencyKey) {
      qb.andWhere('request.idempotency_key = :idempotencyKey', {
        idempotencyKey: filters.idempotencyKey,
      });
    }

    if (filters.requestedFrom) {
      qb.andWhere('request.requested_at >= :requestedFrom', {
        requestedFrom: filters.requestedFrom,
      });
    }

    if (filters.requestedTo) {
      qb.andWhere('request.requested_at <= :requestedTo', {
        requestedTo: filters.requestedTo,
      });
    }

    qb.orderBy('request.requested_at', 'DESC');

    const [items, total] = await qb
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return { items, total, page, size };
  }

  async getStats(filters?: {
    requestedFrom?: Date;
    requestedTo?: Date;
    clientSystemId?: string;
  }): Promise<NotificationRequestStats> {
    const baseQb = this.repository
      .createQueryBuilder('request')
      .where('request.archived_at IS NULL');

    if (filters?.clientSystemId) {
      baseQb.andWhere('request.client_system_id = :clientSystemId', {
        clientSystemId: filters.clientSystemId,
      });
    }

    if (filters?.requestedFrom) {
      baseQb.andWhere('request.requested_at >= :requestedFrom', {
        requestedFrom: filters.requestedFrom,
      });
    }

    if (filters?.requestedTo) {
      baseQb.andWhere('request.requested_at <= :requestedTo', {
        requestedTo: filters.requestedTo,
      });
    }

    const byStatus = await baseQb
      .clone()
      .select('request.status', 'key')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.status')
      .getRawMany<{ key: string; count: string }>();

    const byChannel = await baseQb
      .clone()
      .leftJoin('request.notificationChannel', 'channel')
      .select("COALESCE(channel.code, 'UNKNOWN')", 'key')
      .addSelect('COUNT(*)', 'count')
      .groupBy('channel.code')
      .getRawMany<{ key: string; count: string }>();

    const byClientSystem = await baseQb
      .clone()
      .innerJoin('request.clientSystem', 'clientSystem')
      .select('clientSystem.code', 'key')
      .addSelect('COUNT(*)', 'count')
      .groupBy('clientSystem.code')
      .getRawMany<{ key: string; count: string }>();

    const total = await baseQb.clone().getCount();

    const mapRows = (rows: { key: string; count: string }[]) =>
      rows.map((row) => ({ key: row.key, count: Number(row.count) }));

    return {
      byStatus: mapRows(byStatus),
      byChannel: mapRows(byChannel),
      byClientSystem: mapRows(byClientSystem),
      total,
    };
  }

  async archiveOlderThan(before: Date) {
    const result = await this.repository
      .createQueryBuilder()
      .update(NotificationRequestEntity)
      .set({ archivedAt: new Date() })
      .where('archived_at IS NULL')
      .andWhere('requested_at < :before', { before })
      .andWhere('status IN (:...statuses)', {
        statuses: ['SENT', 'FAILED', 'CANCELED', 'PARTIAL'],
      })
      .execute();

    return result.affected ?? 0;
  }
}
