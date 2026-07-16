import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationDeliveryStatus } from 'src/domain/enums';
import { NotificationDeliveryRepository } from 'src/domain/repositories/notification-delivery.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationDeliveryEntity } from '../typeorm/entities/notification-delivery.entity';

@Injectable()
export class NotificationDeliveryTypeormRepository
  extends GenericRepository<NotificationDeliveryEntity>
  implements NotificationDeliveryRepository
{
  constructor(
    @InjectRepository(NotificationDeliveryEntity)
    repository: Repository<NotificationDeliveryEntity>,
  ) {
    super(repository);
  }

  findAllByNotificationRequestId(notificationRequestId: string) {
    return this.repository.find({
      where: { notificationRequestId },
      order: { createdAt: 'ASC' },
    });
  }

  findFailedByNotificationRequestId(notificationRequestId: string) {
    return this.repository.find({
      where: {
        notificationRequestId,
        status: NotificationDeliveryStatus.FAILED,
      },
      order: { createdAt: 'ASC' },
    });
  }

  async createMany(deliveries: Partial<NotificationDeliveryEntity>[]) {
    const entities = this.repository.create(deliveries);
    return this.repository.save(entities);
  }
}
