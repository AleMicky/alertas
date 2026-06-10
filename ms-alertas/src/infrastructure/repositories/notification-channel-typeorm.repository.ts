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

  findByCode(code: string) {
    return this.repository.findOne({
      where: { code },
    });
  }

  async findByRecipientChannel(code: string) {
    for (const candidate of notificationChannelLookupCodes(code)) {
      const channel = await this.findByCode(candidate);

      if (channel) {
        return channel;
      }
    }

    return null;
  }

  findActiveByType(type: string) {
    return this.repository.find({
      where: {
        code: type,
        active: true,
      },
    });
  }
}
