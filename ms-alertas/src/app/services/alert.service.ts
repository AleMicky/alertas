import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/shared/core/base.service';
import { AlertMapper } from 'src/app/mappers/alert.mapper';
import { Alert } from 'src/domain/entities/alert';
import { Event } from 'src/domain/entities/event';
import { AlertRepository } from 'src/domain/repositories/alert.repository';
import { AlertNotificationRepository } from 'src/domain/repositories/alert-notification.repository';
import { AlertStatus } from 'src/domain/enums/alert-status.enum';
import { ResponseAlertDto } from 'src/presentation/dto/alert/response-alert.dto';

import { AlertNotificationService } from './alert-notification.service';
import { AlertOutcomeService } from './alert-outcome.service';

@Injectable()
export class AlertService extends BaseService<Alert> {
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly alertNotificationRepository: AlertNotificationRepository,
    private readonly alertMapper: AlertMapper,
    private readonly alertNotificationService: AlertNotificationService,
    private readonly alertOutcomeService: AlertOutcomeService,
  ) {
    super(alertRepository);
  }

  async createFromEvent(event: Event): Promise<Alert> {
    const alert = await this.alertRepository.create({
      event,
      status: AlertStatus.OPEN,
      createdAt: new Date(),
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

  async findAllMapped(): Promise<ResponseAlertDto[]> {
    const alerts = await this.alertRepository.findAll();

    return this.mapAlerts(alerts);
  }

  async findOneMapped(id: string): Promise<ResponseAlertDto | null> {
    const alert = await this.alertRepository.findOne(id);

    if (!alert) {
      return null;
    }

    const [mapped] = await this.mapAlerts([alert]);

    return mapped ?? null;
  }

  async findByEventIdMapped(eventId: string): Promise<ResponseAlertDto[]> {
    const alerts = await this.alertRepository.findByEventId(eventId);

    return this.mapAlerts(alerts);
  }

  async findByStatusMapped(status: string): Promise<ResponseAlertDto[]> {
    const alerts = await this.alertRepository.findByStatus(status);

    return this.mapAlerts(alerts);
  }

  private async mapAlerts(alerts: Alert[]): Promise<ResponseAlertDto[]> {
    if (alerts.length === 0) {
      return [];
    }

    const statsByAlertId =
      await this.alertNotificationRepository.countStatsByAlertIds(
        alerts.map((alert) => alert.id),
      );

    return alerts.map((alert) =>
      this.alertMapper.toResponse(
        alert,
        statsByAlertId[alert.id] ?? {
          total: 0,
          sent: 0,
          failed: 0,
          pending: 0,
        },
      ),
    );
  }

  async markAsNotified(alertId: string): Promise<Alert> {
    return this.alertRepository.update(alertId, {
      status: AlertStatus.NOTIFIED,
    });
  }

  async markAsFailed(alertId: string): Promise<Alert> {
    return this.alertRepository.update(alertId, {
      status: AlertStatus.FAILED,
    });
  }
}
