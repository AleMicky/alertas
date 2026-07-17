import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  SystemNotificationData,
  SystemNotificationWithReadState,
} from 'src/domain/entities/system-notification';
import { SystemNotificationRepository } from 'src/domain/repositories/system-notification.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { SystemNotificationEntity } from '../typeorm/entities/system-notification.entity';
import { SystemNotificationReadEntity } from '../typeorm/entities/system-notification-read.entity';

@Injectable()
export class SystemNotificationTypeormRepository
  extends GenericRepository<SystemNotificationEntity>
  implements SystemNotificationRepository
{
  constructor(
    @InjectRepository(SystemNotificationEntity)
    repository: Repository<SystemNotificationEntity>,
    @InjectRepository(SystemNotificationReadEntity)
    private readonly readRepository: Repository<SystemNotificationReadEntity>,
  ) {
    super(repository);
  }

  async findForUser(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean },
  ): Promise<SystemNotificationWithReadState[]> {
    const limit = Math.min(Math.max(options?.limit ?? 20, 1), 100);
    const unreadOnly = options?.unreadOnly ?? false;

    const qb = this.repository
      .createQueryBuilder('notification')
      .orderBy('notification.createdAt', 'DESC')
      .take(limit);

    if (unreadOnly) {
      qb.where(
        `NOT EXISTS (
          SELECT 1
          FROM tsystem_notification_reads read_row
          WHERE read_row.system_notification_id = notification.id
            AND read_row.user_id = :userId
        )`,
        { userId },
      );
    }

    const entities = await qb.getMany();

    if (entities.length === 0) {
      return [];
    }

    const reads = await this.readRepository.find({
      where: {
        userId,
        systemNotificationId: In(entities.map((entity) => entity.id)),
      },
    });
    const readAtById = new Map(
      reads.map((read) => [read.systemNotificationId, read.readAt]),
    );

    return entities.map((entity) => {
      const readAt = readAtById.get(entity.id) ?? null;

      return {
        ...this.toData(entity),
        read: Boolean(readAt),
        readAt,
      };
    });
  }

  async countUnreadForUser(userId: string): Promise<number> {
    return this.repository
      .createQueryBuilder('notification')
      .where(
        `NOT EXISTS (
          SELECT 1
          FROM tsystem_notification_reads read_row
          WHERE read_row.system_notification_id = notification.id
            AND read_row.user_id = :userId
        )`,
        { userId },
      )
      .getCount();
  }

  async markAsRead(
    systemNotificationId: string,
    userId: string,
  ): Promise<SystemNotificationWithReadState | null> {
    const notification = await this.findOne(systemNotificationId);

    if (!notification) {
      return null;
    }

    let read = await this.readRepository.findOne({
      where: { systemNotificationId, userId },
    });

    if (!read) {
      read = await this.readRepository.save(
        this.readRepository.create({
          systemNotificationId,
          userId,
          readAt: new Date(),
        }),
      );
    }

    return {
      ...this.toData(notification),
      read: true,
      readAt: read.readAt,
    };
  }

  async markAllAsRead(userId: string): Promise<number> {
    const unreadIds = await this.repository
      .createQueryBuilder('notification')
      .select('notification.id', 'id')
      .where(
        `NOT EXISTS (
          SELECT 1
          FROM tsystem_notification_reads read_row
          WHERE read_row.system_notification_id = notification.id
            AND read_row.user_id = :userId
        )`,
        { userId },
      )
      .getRawMany<{ id: string }>();

    if (unreadIds.length === 0) {
      return 0;
    }

    const toCreate = unreadIds.map((row) =>
      this.readRepository.create({
        systemNotificationId: row.id,
        userId,
        readAt: new Date(),
      }),
    );

    await this.readRepository.save(toCreate);
    return toCreate.length;
  }

  private toData(entity: SystemNotificationEntity): SystemNotificationData {
    return {
      id: entity.id,
      type: entity.type,
      title: entity.title,
      body: entity.body,
      href: entity.href,
      notificationRequestId: entity.notificationRequestId,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
    };
  }
}
