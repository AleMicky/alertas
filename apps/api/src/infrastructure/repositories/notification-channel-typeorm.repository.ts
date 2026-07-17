import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { notificationChannelLookupCodes } from 'src/app/utils/normalize-notification-channel.util';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';
import { NotificationChannelEntity } from '../typeorm/entities/notification-channel.entity';

@Injectable()
export class NotificationChannelTypeormRepository
  extends GenericRepository<NotificationChannelEntity>
  implements NotificationChannelRepository
{
  constructor(
    @InjectRepository(NotificationChannelEntity)
    repository: Repository<NotificationChannelEntity>,
  ) {
    super(repository);
  }

  async findByCode(code: string) {
    for (const candidate of notificationChannelLookupCodes(code)) {
      const channel = await this.repository
        .createQueryBuilder('channel')
        .where('UPPER(channel.code) = :code', {
          code: candidate.trim().toUpperCase(),
        })
        .getOne();

      if (channel) {
        return channel;
      }
    }

    return null;
  }
}
