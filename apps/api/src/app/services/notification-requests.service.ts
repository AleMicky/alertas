import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Job, Queue } from 'bullmq';

import { buildProviderRequestHeaders } from 'src/app/utils/build-provider-request-headers.util';
import {
  assertNotificationRequestStatusTransition,
  CANCELABLE_NOTIFICATION_REQUEST_STATUSES,
  EDITABLE_NOTIFICATION_REQUEST_STATUSES,
  PROCESSABLE_NOTIFICATION_REQUEST_STATUSES,
} from 'src/app/utils/notification-request-state-machine.util';
import { recalculateNotificationRequestStatusFromDeliveries } from 'src/app/utils/recalculate-notification-request-status.util';
import { validateNotificationAttachments } from 'src/app/utils/validate-notification-attachments.util';
import {
  NotificationRequest,
  NotificationRequestData,
} from 'src/domain/entities/notification-request';
import {
  NotificationDeliveryStatus,
  NotificationPriority,
  NotificationRequestStatus,
} from 'src/domain/enums';
import { NotificationAttachmentRepository } from 'src/domain/repositories/notification-attachment.repository';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';
import { NotificationDeliveryAttemptRepository } from 'src/domain/repositories/notification-delivery-attempt.repository';
import { NotificationDeliveryRepository } from 'src/domain/repositories/notification-delivery.repository';
import { NotificationRequestRepository } from 'src/domain/repositories/notification-request.repository';
import {
  NotificationRequestSearchFilters,
  NotificationRequestStats,
} from 'src/domain/types/notification-request-search.types';
import { N8nClient } from 'src/infrastructure/integrations/n8n/n8n.client';
import { BaseService } from 'src/shared/core/base.service';
import {
  ArchiveNotificationRequestsDto,
  ChangeNotificationRequestStatusDto,
  CreateNotificationRequestDto,
  ListNotificationRequestsQueryDto,
  NotificationRequestStatsQueryDto,
  ScheduleNotificationRequestDto,
  UpdateNotificationRequestDto,
} from 'src/presentation/dto/notification-request';
import { NotificationChannelProvidersService } from './notification-channel-providers.service';
import { NotificationPayloadSchemasService } from './notification-payload-schemas.service';
import { NotificationRequestAuditService } from './notification-request-audit.service';
import { SystemNotificationsService } from './system-notifications.service';
import {
  NOTIFICATION_REQUEST_JOB,
  NOTIFICATION_REQUEST_QUEUE,
} from '../queues/notification-request.queue';

@Injectable()
export class NotificationRequestsService extends BaseService<NotificationRequestData> {
  private readonly logger = new Logger(NotificationRequestsService.name);

  constructor(
    private readonly notificationRequestRepository: NotificationRequestRepository,
    private readonly notificationAttachmentRepository: NotificationAttachmentRepository,
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository,
    private readonly notificationDeliveryAttemptRepository: NotificationDeliveryAttemptRepository,
    private readonly notificationChannelRepository: NotificationChannelRepository,
    private readonly notificationPayloadSchemasService: NotificationPayloadSchemasService,
    private readonly notificationChannelProvidersService: NotificationChannelProvidersService,
    private readonly notificationRequestAuditService: NotificationRequestAuditService,
    private readonly systemNotificationsService: SystemNotificationsService,
    private readonly n8nClient: N8nClient,
    @InjectQueue(NOTIFICATION_REQUEST_QUEUE)
    private readonly notificationRequestQueue: Queue,
  ) {
    super(notificationRequestRepository);
  }

  search(filters: ListNotificationRequestsQueryDto) {
    return this.notificationRequestRepository.search(
      this.mapSearchFilters(filters),
    );
  }

  getStats(
    query: NotificationRequestStatsQueryDto,
  ): Promise<NotificationRequestStats> {
    return this.notificationRequestRepository.getStats({
      clientSystemId: query.clientSystemId,
      requestedFrom: query.requestedFrom
        ? new Date(query.requestedFrom)
        : undefined,
      requestedTo: query.requestedTo ? new Date(query.requestedTo) : undefined,
    });
  }

  async getDetail(id: string) {
    const request = await this.findOne(id);

    if (!request) {
      throw new NotFoundException('Solicitud de notificación no encontrada');
    }

    const [attachments, deliveries, audits, attempts] = await Promise.all([
      this.notificationAttachmentRepository.findAllByNotificationRequestId(id),
      this.notificationDeliveryRepository.findAllByNotificationRequestId(id),
      this.notificationRequestAuditService.findByNotificationRequestId(id),
      this.notificationDeliveryAttemptRepository.findAllByNotificationRequestId(
        id,
      ),
    ]);

    return { request, attachments, deliveries, audits, attempts };
  }

  findAllByClientSystemId(clientSystemId: string) {
    return this.notificationRequestRepository.findAllByClientSystemId(
      clientSystemId,
    );
  }

  async submit(clientSystemId: string, dto: CreateNotificationRequestDto) {
    const idempotencyKey = dto.idempotencyKey?.trim();

    if (idempotencyKey) {
      const existing =
        await this.notificationRequestRepository.findByClientSystemIdAndIdempotencyKey(
          clientSystemId,
          idempotencyKey,
        );

      if (existing) {
        return this.getDetail(existing.id);
      }
    }

    const channel = await this.assertActiveChannel(dto.channel);

    const attachmentValidation = validateNotificationAttachments(
      dto.attachments ?? [],
    );

    if (!attachmentValidation.valid) {
      throw new BadRequestException({
        message: 'Adjuntos inválidos',
        errors: attachmentValidation.errors,
      });
    }

    const schemaValidation =
      await this.notificationPayloadSchemasService.validatePayloadAgainstActiveChannel(
        channel.code,
        dto.payload,
      );

    if (!schemaValidation.valid) {
      throw new BadRequestException({
        message: 'Payload inválido para el canal indicado',
        errors: schemaValidation.errors,
      });
    }

    const payload = this.buildStoredPayload(dto, channel.code);

    const scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    const now = new Date();

    if (expiresAt && expiresAt.getTime() <= now.getTime()) {
      throw new BadRequestException(
        'La solicitud ya está expirada (expiresAt)',
      );
    }

    const created = await this.notificationRequestRepository.create({
      clientSystemId,
      notificationChannelId: channel.id,
      externalReference: dto.externalReference?.trim() ?? null,
      correlationId: dto.correlationId?.trim() ?? null,
      idempotencyKey: idempotencyKey ?? null,
      title: dto.title?.trim() ?? null,
      message: dto.message ?? null,
      payload,
      metadata: dto.metadata ?? null,
      status: NotificationRequestStatus.RECEIVED,
      priority: dto.priority ?? NotificationPriority.NORMAL,
      scheduledAt,
      expiresAt,
      archivedAt: null,
      requestedAt: now,
    });

    await this.notificationRequestAuditService.recordStatusChange({
      notificationRequestId: created.id,
      fromStatus: null,
      toStatus: NotificationRequestStatus.RECEIVED,
      reason: 'Solicitud recibida',
    });

    if (dto.attachments?.length) {
      await this.notificationAttachmentRepository.createMany(
        dto.attachments.map((attachment, index) => ({
          notificationRequestId: created.id,
          fileName: attachment.fileName.trim(),
          url: attachment.url.trim(),
          mimeType: attachment.mimeType.trim().toLowerCase(),
          sizeBytes: attachment.sizeBytes,
          checksum: attachment.checksum?.trim() ?? null,
          sortOrder: attachment.sortOrder ?? index,
        })),
      );
    }

    await this.notificationDeliveryRepository.createMany([
      {
        notificationRequestId: created.id,
        notificationChannelProviderId: null,
        status: NotificationDeliveryStatus.PENDING,
        attemptCount: 0,
        providerMessageId: null,
        errorMessage: null,
        lastAttemptAt: null,
        deliveredAt: null,
        failedAt: null,
        metadata: null,
      },
    ]);

    const request = this.toDomain(created);
    request.markQueued();
    await this.transitionStatus(request, NotificationRequestStatus.QUEUED, {
      reason: 'Solicitud encolada',
    });

    await this.enqueueRequest(created.id, scheduledAt);

    try {
      await this.systemNotificationsService.notifyNotificationRequestCreated({
        notificationRequestId: created.id,
        clientSystemId,
        channelCode: channel.code,
        title: dto.title,
        externalReference: dto.externalReference,
      });
    } catch (error) {
      this.logger.warn(
        `No se pudo crear la notificación in-app para la solicitud ${created.id}`,
        error instanceof Error ? error.stack : undefined,
      );
    }

    return this.getDetail(created.id);
  }

  async processRequest(notificationRequestId: string, job?: Job) {
    const entity = await this.notificationRequestRepository.findOne(
      notificationRequestId,
    );

    if (!entity) {
      return;
    }

    if (!PROCESSABLE_NOTIFICATION_REQUEST_STATUSES.has(entity.status)) {
      return;
    }

    const request = this.toDomain(entity);

    if (request.isExpired()) {
      await this.transitionStatus(request, NotificationRequestStatus.FAILED, {
        reason: 'Solicitud expirada antes del procesamiento',
      });
      return;
    }

    if (
      request.scheduledAt &&
      request.scheduledAt.getTime() > Date.now() &&
      request.status !== NotificationRequestStatus.PROCESSING
    ) {
      return;
    }

    if (request.status !== NotificationRequestStatus.PROCESSING) {
      await this.transitionStatus(
        request,
        NotificationRequestStatus.PROCESSING,
        {
          reason: 'Inicio de procesamiento',
        },
      );
    }

    const channelCode = this.resolveChannel(request.payload);
    const provider =
      await this.notificationChannelProvidersService.resolveActiveProvider({
        channelCode,
        notificationChannelId: request.notificationChannelId ?? undefined,
      });

    if (!provider) {
      await this.transitionStatus(request, NotificationRequestStatus.FAILED, {
        reason: `No hay proveedor activo para el canal ${channelCode}`,
      });
      return;
    }

    const [attachments, deliveries] = await Promise.all([
      this.notificationAttachmentRepository.findAllByNotificationRequestId(
        notificationRequestId,
      ),
      this.notificationDeliveryRepository.findAllByNotificationRequestId(
        notificationRequestId,
      ),
    ]);

    let delivery = deliveries[0];

    if (!delivery) {
      const [createdDelivery] =
        await this.notificationDeliveryRepository.createMany([
          {
            notificationRequestId,
            notificationChannelProviderId: null,
            status: NotificationDeliveryStatus.PENDING,
            attemptCount: 0,
            providerMessageId: null,
            errorMessage: null,
            lastAttemptAt: null,
            deliveredAt: null,
            failedAt: null,
            metadata: null,
          },
        ]);
      delivery = createdDelivery;
    }

    if (
      delivery.status === NotificationDeliveryStatus.DELIVERED ||
      delivery.status === NotificationDeliveryStatus.SENT
    ) {
      await this.recalculateStatusFromDeliveries(notificationRequestId);
      return;
    }

    const attemptNumber = delivery.attemptCount + 1;
    const requestPayload = {
      notificationId: request.id,
      deliveryId: delivery.id,
      channel: channelCode,
      title: request.title ?? '',
      message: request.message ?? '',
      attachments: attachments.map((attachment) => ({
        fileName: attachment.fileName,
        url: attachment.url,
        mimeType: attachment.mimeType,
        sizeBytes: Number(attachment.sizeBytes),
      })),
      payload: {
        clientSystemId: request.clientSystemId,
        externalReference: request.externalReference,
        correlationId: request.correlationId,
        priority: request.priority,
        ...request.payload,
      },
    };

    try {
      const response = await this.n8nClient.sendNotification(
        provider.webhookUrl,
        requestPayload,
        {
          headers: buildProviderRequestHeaders(provider),
          timeoutMs: provider.timeoutSeconds * 1000,
        },
      );

      await this.notificationDeliveryRepository.update(delivery.id, {
        status: NotificationDeliveryStatus.SENT,
        attemptCount: attemptNumber,
        notificationChannelProviderId: provider.id,
        providerMessageId:
          typeof response === 'object' &&
          response &&
          'messageId' in response &&
          typeof (response as Record<string, unknown>).messageId === 'string'
            ? ((response as Record<string, unknown>).messageId as string)
            : null,
        errorMessage: null,
        lastAttemptAt: new Date(),
        metadata: {
          ...(delivery.metadata ?? {}),
          providerCode: provider.code,
          providerResponse: response,
        },
      });

      await this.notificationDeliveryAttemptRepository.create({
        notificationDeliveryId: delivery.id,
        attemptNumber,
        status: NotificationDeliveryStatus.SENT,
        requestPayload,
        responsePayload:
          typeof response === 'object' && response
            ? (response as Record<string, unknown>)
            : { response },
        errorMessage: null,
        attemptedAt: new Date(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      await this.notificationDeliveryRepository.update(delivery.id, {
        status: NotificationDeliveryStatus.FAILED,
        attemptCount: attemptNumber,
        notificationChannelProviderId: provider.id,
        errorMessage,
        lastAttemptAt: new Date(),
        failedAt: new Date(),
      });

      await this.notificationDeliveryAttemptRepository.create({
        notificationDeliveryId: delivery.id,
        attemptNumber,
        status: NotificationDeliveryStatus.FAILED,
        requestPayload,
        responsePayload: null,
        errorMessage,
        attemptedAt: new Date(),
      });

      const maxAttempts = job?.opts.attempts ?? 1;
      const isLastAttempt = !job || job.attemptsMade >= maxAttempts;

      if (!isLastAttempt) {
        throw error;
      }
    }

    await this.recalculateStatusFromDeliveries(notificationRequestId);

    const refreshed = await this.notificationRequestRepository.findOne(
      notificationRequestId,
    );

    if (
      refreshed &&
      [
        NotificationRequestStatus.FAILED,
        NotificationRequestStatus.PARTIAL,
      ].includes(refreshed.status) &&
      job &&
      job.attemptsMade < (job.opts.attempts ?? 1)
    ) {
      throw new Error('Reintento de procesamiento pendiente');
    }
  }

  async cancel(id: string) {
    const entity = await this.requireRequest(id);

    if (!CANCELABLE_NOTIFICATION_REQUEST_STATUSES.has(entity.status)) {
      throw new BadRequestException(
        'La solicitud no puede cancelarse en su estado actual',
      );
    }

    const request = this.toDomain(entity);
    await this.transitionStatus(request, NotificationRequestStatus.CANCELED, {
      reason: 'Cancelación manual',
    });

    const deliveries =
      await this.notificationDeliveryRepository.findAllByNotificationRequestId(
        id,
      );

    await Promise.all(
      deliveries
        .filter(
          (delivery) =>
            delivery.status === NotificationDeliveryStatus.PENDING ||
            delivery.status === NotificationDeliveryStatus.QUEUED,
        )
        .map((delivery) =>
          this.notificationDeliveryRepository.update(delivery.id, {
            status: NotificationDeliveryStatus.CANCELED,
          }),
        ),
    );

    await this.removeQueueJob(id);

    return this.getDetail(id);
  }

  async requeue(id: string) {
    const entity = await this.requireRequest(id);
    const request = this.toDomain(entity);

    if (
      ![
        NotificationRequestStatus.FAILED,
        NotificationRequestStatus.PARTIAL,
        NotificationRequestStatus.QUEUED,
      ].includes(request.status)
    ) {
      throw new BadRequestException(
        'Solo se pueden reencolar solicitudes FAILED, PARTIAL o QUEUED',
      );
    }

    if (request.isExpired()) {
      throw new BadRequestException('La solicitud está expirada');
    }

    await this.transitionStatus(request, NotificationRequestStatus.QUEUED, {
      reason: 'Reencolado manual',
    });

    await this.enqueueRequest(id, request.scheduledAt);

    return this.getDetail(id);
  }

  async schedule(id: string, dto: ScheduleNotificationRequestDto) {
    const entity = await this.requireRequest(id);

    if (!EDITABLE_NOTIFICATION_REQUEST_STATUSES.has(entity.status)) {
      throw new BadRequestException(
        'Solo se puede programar una solicitud en RECEIVED o QUEUED',
      );
    }

    const scheduledAt = new Date(dto.scheduledAt);

    if (scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException('scheduledAt debe ser una fecha futura');
    }

    const updated = await this.notificationRequestRepository.update(id, {
      scheduledAt,
      updatedAt: new Date(),
    });

    await this.removeQueueJob(id);
    await this.enqueueRequest(id, scheduledAt);

    return this.getDetail(updated.id);
  }

  async changeStatus(id: string, dto: ChangeNotificationRequestStatusDto) {
    const entity = await this.requireRequest(id);
    const request = this.toDomain(entity);

    assertNotificationRequestStatusTransition(request.status, dto.status);
    await this.transitionStatus(request, dto.status, {
      reason: dto.reason ?? 'Cambio manual de estado',
      metadata: dto.metadata,
    });

    if (dto.status === NotificationRequestStatus.QUEUED) {
      await this.enqueueRequest(id, request.scheduledAt);
    }

    return this.getDetail(id);
  }

  async retryFailedDeliveries(id: string) {
    const entity = await this.requireRequest(id);

    if (entity.expiresAt && entity.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('La solicitud está expirada');
    }

    const failedDeliveries =
      await this.notificationDeliveryRepository.findFailedByNotificationRequestId(
        id,
      );

    if (!failedDeliveries.length) {
      throw new BadRequestException(
        'No hay deliveries fallidos para reintentar',
      );
    }

    await Promise.all(
      failedDeliveries.map((delivery) =>
        this.notificationDeliveryRepository.update(delivery.id, {
          status: NotificationDeliveryStatus.QUEUED,
          errorMessage: null,
          failedAt: null,
        }),
      ),
    );

    const request = this.toDomain(entity);
    await this.transitionStatus(request, NotificationRequestStatus.QUEUED, {
      reason: 'Reintento de deliveries fallidos',
    });
    await this.enqueueRequest(id, request.scheduledAt);

    return this.getDetail(id);
  }

  async updateRequest(id: string, dto: UpdateNotificationRequestDto) {
    const entity = await this.requireRequest(id);
    const request = this.toDomain(entity);

    if (!request.isEditable()) {
      throw new BadRequestException(
        'Solo se puede actualizar una solicitud en RECEIVED o QUEUED',
      );
    }

    if (dto.payload && !dto.channel) {
      throw new BadRequestException(
        'Debe indicar channel para validar un nuevo payload',
      );
    }

    const nextChannelCode = dto.channel ?? this.resolveChannel(request.payload);
    const channel = await this.assertActiveChannel(nextChannelCode);

    if (dto.payload) {
      const validation =
        await this.notificationPayloadSchemasService.validatePayloadAgainstActiveChannel(
          channel.code,
          dto.payload,
        );

      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Payload inválido para el canal indicado',
          errors: validation.errors,
        });
      }
    }

    const nextPayload = dto.payload
      ? this.buildStoredPayload(
          {
            ...dto,
            channel: nextChannelCode,
            payload: dto.payload,
          } as CreateNotificationRequestDto,
          channel.code,
        )
      : request.payload;

    const updated = await this.notificationRequestRepository.update(id, {
      notificationChannelId: channel.id,
      title: dto.title?.trim() ?? undefined,
      message: dto.message ?? undefined,
      payload: dto.payload ? nextPayload : undefined,
      metadata: dto.metadata ?? undefined,
      priority: dto.priority ?? undefined,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      updatedAt: new Date(),
    });

    return this.getDetail(updated.id);
  }

  async updateMetadata(id: string, metadata: Record<string, unknown>) {
    await this.requireRequest(id);

    const updated = await this.notificationRequestRepository.update(id, {
      metadata,
      updatedAt: new Date(),
    });

    return this.getDetail(updated.id);
  }

  async archive(dto: ArchiveNotificationRequestsDto) {
    const before = new Date(dto.olderThan);
    const archivedCount =
      await this.notificationRequestRepository.archiveOlderThan(before);

    return { archivedCount, olderThan: dto.olderThan };
  }

  async recalculateStatusFromDeliveries(notificationRequestId: string) {
    const entity = await this.requireRequest(notificationRequestId);
    const deliveries =
      await this.notificationDeliveryRepository.findAllByNotificationRequestId(
        notificationRequestId,
      );
    const nextStatus = recalculateNotificationRequestStatusFromDeliveries(
      deliveries.map((delivery) => delivery.status),
    );
    const request = this.toDomain(entity);

    if (request.status !== nextStatus) {
      await this.transitionStatus(request, nextStatus, {
        reason: 'Recalculado según deliveries',
        metadata: {
          deliveryStatuses: deliveries.map((delivery) => delivery.status),
        },
      });
    }

    return this.getDetail(notificationRequestId);
  }

  async deleteRequest(id: string) {
    const entity = await this.requireRequest(id);

    if (entity.archivedAt) {
      await this.notificationRequestRepository.delete(id);
      return;
    }

    throw new BadRequestException(
      'Solo se pueden eliminar solicitudes archivadas',
    );
  }

  private async assertActiveChannel(channelCode: string) {
    const channel =
      await this.notificationChannelRepository.findByCode(channelCode);

    if (!channel) {
      throw new BadRequestException(
        `Canal de notificación no encontrado: ${channelCode}`,
      );
    }

    if (!channel.active) {
      throw new BadRequestException(`El canal ${channel.code} no está activo`);
    }

    return channel;
  }

  private async requireRequest(id: string) {
    const entity = await this.notificationRequestRepository.findOne(id);

    if (!entity) {
      throw new NotFoundException('Solicitud de notificación no encontrada');
    }

    return entity;
  }

  private async transitionStatus(
    request: NotificationRequest,
    toStatus: NotificationRequestStatus,
    input?: {
      reason?: string;
      metadata?: Record<string, unknown> | null;
      changedBy?: string | null;
    },
  ) {
    const fromStatus = request.status;
    assertNotificationRequestStatusTransition(fromStatus, toStatus);

    switch (toStatus) {
      case NotificationRequestStatus.QUEUED:
        request.markQueued();
        break;
      case NotificationRequestStatus.PROCESSING:
        request.markProcessing();
        break;
      case NotificationRequestStatus.SENT:
        request.markSent();
        break;
      case NotificationRequestStatus.PARTIAL:
        request.markPartial();
        break;
      case NotificationRequestStatus.FAILED:
        request.markFailed();
        break;
      case NotificationRequestStatus.CANCELED:
        request.cancel();
        break;
      default:
        request.status = toStatus;
        request.updatedAt = new Date();
    }

    await this.notificationRequestRepository.update(request.id, {
      status: request.status,
      updatedAt: request.updatedAt,
      metadata: input?.metadata
        ? { ...(request.metadata ?? {}), ...input.metadata }
        : request.metadata,
    });

    await this.notificationRequestAuditService.recordStatusChange({
      notificationRequestId: request.id,
      fromStatus,
      toStatus,
      reason: input?.reason ?? null,
      metadata: input?.metadata ?? null,
      changedBy: input?.changedBy ?? null,
    });
  }

  private async enqueueRequest(
    notificationRequestId: string,
    scheduledAt?: Date | null,
  ) {
    const delay = scheduledAt
      ? Math.max(scheduledAt.getTime() - Date.now(), 0)
      : 0;

    await this.notificationRequestQueue.add(
      NOTIFICATION_REQUEST_JOB,
      { notificationRequestId },
      {
        jobId: notificationRequestId,
        delay,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  private async removeQueueJob(notificationRequestId: string) {
    const job =
      await this.notificationRequestQueue.getJob(notificationRequestId);

    if (job) {
      await job.remove();
    }
  }

  private buildStoredPayload(
    dto: CreateNotificationRequestDto,
    channelCode: string,
  ) {
    return {
      channel: channelCode,
      ...dto.payload,
    };
  }

  private resolveChannel(payload: Record<string, unknown>) {
    const channel = payload.channel;

    if (typeof channel !== 'string' || !channel.trim()) {
      throw new BadRequestException('El canal es obligatorio en el payload');
    }

    return channel.trim();
  }

  private toDomain(entity: NotificationRequestData): NotificationRequest {
    return Object.assign(new NotificationRequest(), entity);
  }

  private mapSearchFilters(
    query: ListNotificationRequestsQueryDto,
  ): NotificationRequestSearchFilters {
    return {
      status: query.status,
      clientSystemId: query.clientSystemId,
      notificationChannelId: query.notificationChannelId,
      channelCode: query.channelCode,
      priority: query.priority,
      externalReference: query.externalReference,
      correlationId: query.correlationId,
      idempotencyKey: query.idempotencyKey,
      requestedFrom: query.requestedFrom
        ? new Date(query.requestedFrom)
        : undefined,
      requestedTo: query.requestedTo ? new Date(query.requestedTo) : undefined,
      includeArchived: query.includeArchived,
      page: query.page,
      size: query.size,
    };
  }
}

@Processor(NOTIFICATION_REQUEST_QUEUE)
export class NotificationRequestProcessor extends WorkerHost {
  constructor(
    private readonly notificationRequestsService: NotificationRequestsService,
  ) {
    super();
  }

  process(job: Job<{ notificationRequestId: string }>) {
    return this.notificationRequestsService.processRequest(
      job.data.notificationRequestId,
      job,
    );
  }
}
