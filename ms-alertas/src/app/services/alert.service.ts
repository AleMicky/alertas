import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/shared/core/base.service';
import { Alert } from 'src/domain/entities/alert';
import { Event } from 'src/domain/entities/event';
import { AlertRepository } from 'src/domain/repositories/alert.repository';
import { AlertStatus } from 'src/domain/enums/alert-status.enum';

import { AlertNotificationService } from './alert-notification.service';
import { AlertOutcomeService } from './alert-outcome.service';

@Injectable()
export class AlertService extends BaseService<Alert> {
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly alertNotificationService: AlertNotificationService,
    private readonly alertOutcomeService: AlertOutcomeService,
  ) {
    super(alertRepository);
  }

  async createFromEvent(event: Event): Promise<Alert> {
    const alert = await this.alertRepository.create({
      event,
      title: event.title,
      message: event.message,
      status: AlertStatus.OPEN,
      alertDate: new Date(),
      active: true,
    });

    const notifications =
      await this.alertNotificationService.createFromAlert(alert);

    if (notifications.length === 0) {
      await this.alertOutcomeService.markNoRecipients(alert);
    }

    return alert;
  }

  findByEventId(eventId: string) {
    return this.alertRepository.findByEventId(eventId);
  }

  findByStatus(status: string) {
    return this.alertRepository.findByStatus(status);
  }
}
