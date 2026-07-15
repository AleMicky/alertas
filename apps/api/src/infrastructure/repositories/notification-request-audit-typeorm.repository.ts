import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationRequestAuditRepository } from 'src/domain/repositories/notification-request-audit.repository';
import { GenericRepository } from 'src/shared/core/generic.repository';
import { NotificationRequestAuditEntity } from '../typeorm/entities/notification-request-audit.entity';

@Injectable()
export class NotificationRequestAuditTypeormRepository
  extends GenericRepository<NotificationRequestAuditEntity>
  implements NotificationRequestAuditRepository
{
  constructor(
    @InjectRepository(NotificationRequestAuditEntity)
    repository: Repository<NotificationRequestAuditEntity>,
  ) {
    super(repository);
  }

  findAllByNotificationRequestId(notificationRequestId: string) {
    return this.repository.find({
      where: { notificationRequestId },
      order: { changedAt: 'DESC' },
    });
  }
}
