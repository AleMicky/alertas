import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationAttachmentRepository } from 'src/domain/repositories/notification-attachment.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationAttachmentEntity } from '../typeorm/entities/notification-attachment.entity';

@Injectable()
export class NotificationAttachmentTypeormRepository
  extends GenericRepository<NotificationAttachmentEntity>
  implements NotificationAttachmentRepository
{
  constructor(
    @InjectRepository(NotificationAttachmentEntity)
    repository: Repository<NotificationAttachmentEntity>,
  ) {
    super(repository);
  }

  findAllByNotificationRequestId(notificationRequestId: string) {
    return this.repository.find({
      where: { notificationRequestId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async createMany(attachments: Partial<NotificationAttachmentEntity>[]) {
    const entities = this.repository.create(attachments);
    return this.repository.save(entities);
  }
}
