import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { notificationChannelLookupCodes } from 'src/app/utils/normalize-notification-channel.util';
import { NotificationPayloadSchemaRepository } from 'src/domain/repositories/notification-payload-schema.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationPayloadSchemaEntity } from '../typeorm/entities/notification-payload-schema.entity';

@Injectable()
export class NotificationPayloadSchemaTypeormRepository
  extends GenericRepository<NotificationPayloadSchemaEntity>
  implements NotificationPayloadSchemaRepository
{
  constructor(
    @InjectRepository(NotificationPayloadSchemaEntity)
    repository: Repository<NotificationPayloadSchemaEntity>,
  ) {
    super(repository);
  }

  findAllByNotificationChannelId(notificationChannelId: string) {
    return this.repository.find({
      where: { notificationChannelId },
      order: { version: 'DESC' },
    });
  }

  findActiveByNotificationChannelId(notificationChannelId: string) {
    return this.repository.findOne({
      where: { notificationChannelId, active: true },
      order: { version: 'DESC' },
    });
  }

  async findActiveByChannelCode(channelCode: string) {
    for (const candidate of notificationChannelLookupCodes(channelCode)) {
      const schema = await this.repository
        .createQueryBuilder('schema')
        .innerJoin('schema.notificationChannel', 'channel')
        .where('UPPER(channel.code) = :code', { code: candidate.toUpperCase() })
        .andWhere('schema.active = :active', { active: true })
        .orderBy('schema.version', 'DESC')
        .getOne();

      if (schema) {
        return schema;
      }
    }

    return null;
  }

  findByNotificationChannelIdAndVersion(
    notificationChannelId: string,
    version: number,
  ) {
    return this.repository.findOne({
      where: {
        notificationChannelId,
        version,
      },
    });
  }

  async findMaxVersionByNotificationChannelId(notificationChannelId: string) {
    const result = await this.repository
      .createQueryBuilder('schema')
      .select('MAX(schema.version)', 'maxVersion')
      .where('schema.notification_channel_id = :notificationChannelId', {
        notificationChannelId,
      })
      .getRawOne<{ maxVersion: string | null }>();

    return result?.maxVersion ? Number(result.maxVersion) : 0;
  }

  async deactivateAllByNotificationChannelId(
    notificationChannelId: string,
    exceptId?: string,
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .update(NotificationPayloadSchemaEntity)
      .set({ active: false })
      .where('notification_channel_id = :notificationChannelId', {
        notificationChannelId,
      });

    if (exceptId) {
      queryBuilder.andWhere('id != :exceptId', { exceptId });
    }

    await queryBuilder.execute();
  }
}
