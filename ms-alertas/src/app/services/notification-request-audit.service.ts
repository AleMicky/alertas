import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { NotificationRequestStatus } from 'src/domain/enums';
import { NotificationRequestAuditRepository } from 'src/domain/repositories/notification-request-audit.repository';
import { CLS_USERNAME } from 'src/shared/cls/cls.keys';

@Injectable()
export class NotificationRequestAuditService {
  constructor(
    private readonly notificationRequestAuditRepository: NotificationRequestAuditRepository,
    private readonly cls: ClsService,
  ) {}

  findByNotificationRequestId(notificationRequestId: string) {
    return this.notificationRequestAuditRepository.findAllByNotificationRequestId(
      notificationRequestId,
    );
  }

  async recordStatusChange(input: {
    notificationRequestId: string;
    fromStatus: NotificationRequestStatus | null;
    toStatus: NotificationRequestStatus;
    reason?: string | null;
    metadata?: Record<string, unknown> | null;
    changedBy?: string | null;
  }) {
    if (input.fromStatus === input.toStatus) {
      return null;
    }

    return this.notificationRequestAuditRepository.create({
      notificationRequestId: input.notificationRequestId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      reason: input.reason ?? null,
      metadata: input.metadata ?? null,
      changedBy:
        input.changedBy ??
        this.cls.get<string>(CLS_USERNAME) ??
        'SYSTEM',
      changedAt: new Date(),
    });
  }
}
