import { Injectable, NotFoundException } from '@nestjs/common';

import { SystemNotificationType } from 'src/domain/enums';
import { ClientSystemRepository } from 'src/domain/repositories/client-system.repository';
import { SystemNotificationRepository } from 'src/domain/repositories/system-notification.repository';

@Injectable()
export class SystemNotificationsService {
  constructor(
    private readonly systemNotificationRepository: SystemNotificationRepository,
    private readonly clientSystemRepository: ClientSystemRepository,
  ) {}

  findForUser(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean },
  ) {
    return this.systemNotificationRepository.findForUser(userId, options);
  }

  countUnreadForUser(userId: string) {
    return this.systemNotificationRepository.countUnreadForUser(userId);
  }

  async markAsRead(systemNotificationId: string, userId: string) {
    const updated = await this.systemNotificationRepository.markAsRead(
      systemNotificationId,
      userId,
    );

    if (!updated) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return updated;
  }

  async markAllAsRead(userId: string) {
    const marked = await this.systemNotificationRepository.markAllAsRead(
      userId,
    );

    return { marked };
  }

  async notifyNotificationRequestCreated(input: {
    notificationRequestId: string;
    clientSystemId: string;
    channelCode: string;
    title?: string | null;
    externalReference?: string | null;
  }) {
    const clientSystem = await this.clientSystemRepository.findOne(
      input.clientSystemId,
    );
    const clientSystemName = clientSystem?.name ?? input.clientSystemId;
    const requestLabel =
      input.title?.trim() ||
      input.externalReference?.trim() ||
      input.notificationRequestId.slice(0, 8);

    return this.systemNotificationRepository.create({
      type: SystemNotificationType.NOTIFICATION_REQUEST_CREATED,
      title: 'Nueva solicitud de notificación',
      body: `${clientSystemName} · ${input.channelCode} · ${requestLabel}`,
      href: `/notification-requests?requestId=${input.notificationRequestId}`,
      notificationRequestId: input.notificationRequestId,
      metadata: {
        clientSystemId: input.clientSystemId,
        clientSystemName,
        channelCode: input.channelCode,
        title: input.title ?? null,
        externalReference: input.externalReference ?? null,
      },
      createdAt: new Date(),
    });
  }
}
