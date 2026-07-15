import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { NotificationDeliveryStatus, NotificationRecipientStatus } from 'src/domain/enums';
import { NotificationDeliveryRepository } from 'src/domain/repositories/notification-delivery.repository';
import { NotificationRecipientRepository } from 'src/domain/repositories/notification-recipient.repository';
import { NotificationDeliveryAttemptRepository } from 'src/domain/repositories/notification-delivery-attempt.repository';
import { N8nDeliveryCallbackDto } from 'src/presentation/dto/notification-request';
import { NotificationRequestsService } from './notification-requests.service';

@Injectable()
export class NotificationCallbacksService {
  constructor(
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository,
    private readonly notificationRecipientRepository: NotificationRecipientRepository,
    private readonly notificationDeliveryAttemptRepository: NotificationDeliveryAttemptRepository,
    private readonly notificationRequestsService: NotificationRequestsService,
  ) {}

  async handleDeliveryCallback(dto: N8nDeliveryCallbackDto) {
    if (!dto.status?.trim()) {
      throw new BadRequestException('status es obligatorio en el callback');
    }

    const delivery = await this.notificationDeliveryRepository.findOne(
      dto.deliveryId,
    );

    if (!delivery) {
      throw new NotFoundException('Delivery no encontrado');
    }

    const nextDeliveryStatus = this.mapCallbackStatus(dto.status);
    const now = new Date();

    await this.notificationDeliveryRepository.update(delivery.id, {
      status: nextDeliveryStatus,
      providerMessageId: dto.providerMessageId ?? delivery.providerMessageId,
      errorMessage: dto.errorMessage ?? null,
      deliveredAt:
        nextDeliveryStatus === NotificationDeliveryStatus.DELIVERED
          ? now
          : delivery.deliveredAt,
      failedAt:
        nextDeliveryStatus === NotificationDeliveryStatus.FAILED
          ? now
          : delivery.failedAt,
      metadata: {
        ...(delivery.metadata ?? {}),
        callback: dto.metadata ?? {},
      },
      updatedAt: now,
    });

    await this.notificationDeliveryAttemptRepository.create({
      notificationDeliveryId: delivery.id,
      attemptNumber: delivery.attemptCount,
      status: nextDeliveryStatus,
      requestPayload: null,
      responsePayload: dto.metadata ?? { status: dto.status },
      errorMessage: dto.errorMessage ?? null,
      attemptedAt: now,
    });

    const recipientStatus =
      nextDeliveryStatus === NotificationDeliveryStatus.DELIVERED
        ? NotificationRecipientStatus.DELIVERED
        : nextDeliveryStatus === NotificationDeliveryStatus.FAILED
          ? NotificationRecipientStatus.FAILED
          : NotificationRecipientStatus.SENT;

    await this.notificationRecipientRepository.update(
      delivery.notificationRecipientId,
      { status: recipientStatus, updatedAt: now },
    );

    return this.notificationRequestsService.recalculateStatusFromDeliveries(
      delivery.notificationRequestId,
    );
  }

  private mapCallbackStatus(status: string): NotificationDeliveryStatus {
    const normalized = status.trim().toUpperCase();

    switch (normalized) {
      case 'DELIVERED':
        return NotificationDeliveryStatus.DELIVERED;
      case 'FAILED':
      case 'ERROR':
        return NotificationDeliveryStatus.FAILED;
      case 'SENT':
        return NotificationDeliveryStatus.SENT;
      default:
        throw new BadRequestException(`Estado de callback no soportado: ${status}`);
    }
  }
}
