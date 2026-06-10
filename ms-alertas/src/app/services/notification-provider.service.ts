import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/shared/core/base.service';
import { NotificationProvider } from 'src/domain/entities/notification-provider';
import { NotificationProviderRepository } from 'src/domain/repositories/notification-provider.repository';

@Injectable()
export class NotificationProviderService extends BaseService<NotificationProvider> {
  constructor(
    private readonly notificationProviderRepository: NotificationProviderRepository,
  ) {
    super(notificationProviderRepository);
  }

  findByCode(code: string) {
    return this.notificationProviderRepository.findByCode(code);
  }

  findByNotificationChannelId(notificationChannelId: string) {
    return this.notificationProviderRepository.findByNotificationChannelId(
      notificationChannelId,
    );
  }

  findByClientSystemId(clientSystemId: string) {
    return this.notificationProviderRepository.findByClientSystemId(
      clientSystemId,
    );
  }
}
