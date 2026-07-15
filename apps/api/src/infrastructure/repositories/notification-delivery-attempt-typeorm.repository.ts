import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationDeliveryAttemptRepository } from 'src/domain/repositories/notification-delivery-attempt.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationDeliveryAttemptEntity } from '../typeorm/entities/notification-delivery-attempt.entity';

@Injectable()
export class NotificationDeliveryAttemptTypeormRepository
  extends GenericRepository<NotificationDeliveryAttemptEntity>
  implements NotificationDeliveryAttemptRepository
{
  constructor(
    @InjectRepository(NotificationDeliveryAttemptEntity)
    repository: Repository<NotificationDeliveryAttemptEntity>,
  ) {
    super(repository);
  }

  findAllByDeliveryId(notificationDeliveryId: string) {
    return this.repository.find({
      where: { notificationDeliveryId },
      order: { attemptNumber: 'ASC' },
    });
  }

  findAllByNotificationRequestId(notificationRequestId: string) {
    return this.repository
      .createQueryBuilder('attempt')
      .innerJoin('attempt.notificationDelivery', 'delivery')
      .where('delivery.notification_request_id = :notificationRequestId', {
        notificationRequestId,
      })
      .orderBy('attempt.attempted_at', 'DESC')
      .getMany();
  }
}
