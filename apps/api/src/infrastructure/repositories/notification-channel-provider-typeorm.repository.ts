import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { notificationChannelLookupCodes } from 'src/app/utils/normalize-notification-channel.util';
import { NotificationChannelProviderRepository } from 'src/domain/repositories/notification-channel-provider.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationChannelProviderEntity } from '../typeorm/entities/notification-channel-provider.entity';

@Injectable()
export class NotificationChannelProviderTypeormRepository
  extends GenericRepository<NotificationChannelProviderEntity>
  implements NotificationChannelProviderRepository
{
  constructor(
    @InjectRepository(NotificationChannelProviderEntity)
    repository: Repository<NotificationChannelProviderEntity>,
  ) {
    super(repository);
  }

  findAllByNotificationChannelId(notificationChannelId: string) {
    return this.repository.find({
      where: { notificationChannelId },
      order: { createdAt: 'ASC' },
    });
  }

  findActiveByNotificationChannelId(notificationChannelId: string) {
    return this.repository.find({
      where: { notificationChannelId, active: true },
      order: { createdAt: 'ASC' },
    });
  }

  findDefaultByNotificationChannelId(notificationChannelId: string) {
    return this.repository.findOne({
      where: { notificationChannelId, active: true },
      order: { createdAt: 'ASC' },
    });
  }

  findByCodeAndNotificationChannelId(
    code: string,
    notificationChannelId: string,
  ) {
    return this.repository.findOne({
      where: {
        code: code.trim().toUpperCase(),
        notificationChannelId,
      },
    });
  }

  findActiveByCodeAndNotificationChannelId(
    code: string,
    notificationChannelId: string,
  ) {
    return this.repository.findOne({
      where: {
        code: code.trim().toUpperCase(),
        notificationChannelId,
        active: true,
      },
    });
  }

  async findByChannelCode(channelCode: string) {
    for (const candidate of notificationChannelLookupCodes(channelCode)) {
      const provider = await this.repository
        .createQueryBuilder('provider')
        .innerJoin('provider.notificationChannel', 'channel')
        .where('channel.code = :code', { code: candidate })
        .andWhere('provider.active = :active', { active: true })
        .orderBy('provider.createdAt', 'ASC')
        .getOne();

      if (provider) {
        return provider;
      }
    }

    return null;
  }

  async findActiveByChannelCodeAndProviderCode(
    channelCode: string,
    providerCode: string,
  ) {
    for (const candidate of notificationChannelLookupCodes(channelCode)) {
      const provider = await this.repository
        .createQueryBuilder('provider')
        .innerJoin('provider.notificationChannel', 'channel')
        .where('channel.code = :code', { code: candidate })
        .andWhere('provider.code = :providerCode', {
          providerCode: providerCode.trim().toUpperCase(),
        })
        .andWhere('provider.active = :active', { active: true })
        .getOne();

      if (provider) {
        return provider;
      }
    }

    return null;
  }

  async deactivateAllByNotificationChannelId(
    notificationChannelId: string,
    exceptId?: string,
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .update(NotificationChannelProviderEntity)
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
