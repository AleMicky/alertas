import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/shared/core/base.service';
import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';

@Injectable()
export class NotificationChannelsService extends BaseService<NotificationChannel> {
  constructor(
    private readonly notificationChannelRepository: NotificationChannelRepository,
  ) {
    super(notificationChannelRepository);
  }

  findByCode(code: string) {
    return this.notificationChannelRepository.findByCode(code);
  }
}
