import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationRecipientRepository } from 'src/domain/repositories/notification-recipient.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationRecipientEntity } from '../typeorm/entities/notification-recipient.entity';

@Injectable()
export class NotificationRecipientTypeormRepository
  extends GenericRepository<NotificationRecipientEntity>
  implements NotificationRecipientRepository
{
  constructor(
    @InjectRepository(NotificationRecipientEntity)
    repository: Repository<NotificationRecipientEntity>,
  ) {
    super(repository);
  }

  findAllByNotificationRequestId(notificationRequestId: string) {
    return this.repository.find({
      where: { notificationRequestId },
      order: { createdAt: 'ASC' },
    });
  }

  async createMany(recipients: Partial<NotificationRecipientEntity>[]) {
    const entities = this.repository.create(recipients);
    return this.repository.save(entities);
  }
}
