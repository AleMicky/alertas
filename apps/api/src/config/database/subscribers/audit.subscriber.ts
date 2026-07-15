import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  DataSource,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';

@EventSubscriber()
@Injectable()
export class AuditSubscriber
  implements EntitySubscriberInterface
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  beforeInsert(event: InsertEvent<any>) {
    const cls = ClsServiceManager.getClsService();

    const username =
      cls.get('username') ?? 'SYSTEM';

    if (event.entity && 'createdBy' in event.entity) {
      event.entity.createdBy = username;
    }

    if (event.entity && 'updatedBy' in event.entity) {
      event.entity.updatedBy = username;
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const cls = ClsServiceManager.getClsService();

    const username =
      cls.get('username') ?? 'SYSTEM';

    if (
      event.entity &&
      'updatedBy' in event.entity
    ) {
      event.entity.updatedBy = username;
    }
  }
}