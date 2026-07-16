import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  validateNotificationPayloadSchemaConfiguration,
  validatePayloadAgainstSchema,
} from 'src/app/utils/validate-notification-payload-schema.util';
import { NotificationPayloadSchema } from 'src/domain/entities/notification-payload-schema';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';
import { NotificationPayloadSchemaRepository } from 'src/domain/repositories/notification-payload-schema.repository';
import { BaseService } from 'src/shared/core/base.service';

@Injectable()
export class NotificationPayloadSchemasService extends BaseService<NotificationPayloadSchema> {
  constructor(
    private readonly notificationPayloadSchemaRepository: NotificationPayloadSchemaRepository,
    private readonly notificationChannelRepository: NotificationChannelRepository,
  ) {
    super(notificationPayloadSchemaRepository);
  }

  findAllByNotificationChannelId(notificationChannelId: string) {
    return this.notificationPayloadSchemaRepository.findAllByNotificationChannelId(
      notificationChannelId,
    );
  }

  findActiveByNotificationChannelId(notificationChannelId: string) {
    return this.notificationPayloadSchemaRepository.findActiveByNotificationChannelId(
      notificationChannelId,
    );
  }

  findActiveByChannelCode(channelCode: string) {
    return this.findActiveByChannelCodeResolved(channelCode);
  }

  private async findActiveByChannelCodeResolved(channelCode: string) {
    const channel =
      await this.notificationChannelRepository.findByCode(
        channelCode,
      );

    if (!channel) {
      return null;
    }

    return this.findActiveByNotificationChannelId(channel.id);
  }

  async create(entity: Partial<NotificationPayloadSchema>) {
    await this.assertNotificationChannelExists(entity.notificationChannelId);

    const name = entity.name?.trim();

    if (!name) {
      throw new BadRequestException('El nombre del schema es obligatorio');
    }

    this.assertValidConfiguration({
      schemaJson: entity.schemaJson,
      requiredFields: entity.requiredFields,
    });

    const version =
      entity.version ??
      (await this.notificationPayloadSchemaRepository.findMaxVersionByNotificationChannelId(
        entity.notificationChannelId!,
      )) + 1;

    const existing =
      await this.notificationPayloadSchemaRepository.findByNotificationChannelIdAndVersion(
        entity.notificationChannelId!,
        version,
      );

    if (existing) {
      throw new BadRequestException(
        `Ya existe la versión ${version} para este canal`,
      );
    }

    const existingActive =
      await this.notificationPayloadSchemaRepository.findActiveByNotificationChannelId(
        entity.notificationChannelId!,
      );
    const shouldActivate = entity.active ?? !existingActive;

    if (shouldActivate) {
      await this.notificationPayloadSchemaRepository.deactivateAllByNotificationChannelId(
        entity.notificationChannelId!,
      );
    }

    return super.create({
      ...entity,
      name,
      version,
      description: entity.description ?? null,
      example: entity.example ?? null,
      requiredFields: this.normalizeRequiredFields(entity.requiredFields ?? []),
      active: shouldActivate,
    });
  }

  async update(id: string, entity: Partial<NotificationPayloadSchema>) {
    const current = await this.findOne(id);

    if (!current) {
      throw new NotFoundException('Schema de payload no encontrado');
    }

    const nextSchemaJson = entity.schemaJson ?? current.schemaJson;
    const nextRequiredFields = entity.requiredFields ?? current.requiredFields;

    if (entity.schemaJson !== undefined || entity.requiredFields !== undefined) {
      this.assertValidConfiguration({
        schemaJson: nextSchemaJson,
        requiredFields: nextRequiredFields,
      });
    }

    if (entity.active === true) {
      await this.notificationPayloadSchemaRepository.deactivateAllByNotificationChannelId(
        current.notificationChannelId,
        id,
      );
    }

    const patch: Partial<NotificationPayloadSchema> = {};

    if (entity.description !== undefined) {
      patch.description = entity.description;
    }

    if (entity.schemaJson !== undefined) {
      patch.schemaJson = entity.schemaJson;
    }

    if (entity.example !== undefined) {
      patch.example = entity.example;
    }

    if (entity.requiredFields !== undefined) {
      patch.requiredFields = this.normalizeRequiredFields(
        entity.requiredFields,
      );
    }

    if (entity.active !== undefined) {
      patch.active = entity.active;
    }

    return super.update(id, patch);
  }

  async activate(id: string) {
    const schema = await this.findOne(id);

    if (!schema) {
      throw new NotFoundException('Schema de payload no encontrado');
    }

    this.assertValidConfiguration(schema);

    await this.notificationPayloadSchemaRepository.deactivateAllByNotificationChannelId(
      schema.notificationChannelId,
      id,
    );

    return this.update(id, { active: true });
  }

  async deactivate(id: string) {
    const schema = await this.findOne(id);

    if (!schema) {
      throw new NotFoundException('Schema de payload no encontrado');
    }

    return this.update(id, { active: false });
  }

  async validatePayloadById(
    id: string,
    payload: Record<string, unknown>,
  ) {
    const schema = await this.findOne(id);

    if (!schema) {
      throw new NotFoundException('Schema de payload no encontrado');
    }

    return validatePayloadAgainstSchema(schema.schemaJson, payload);
  }

  async validatePayloadAgainstActiveChannel(
    channelCode: string,
    payload: Record<string, unknown>,
  ) {
    const channel =
      await this.notificationChannelRepository.findByCode(
        channelCode,
      );

    if (!channel) {
      throw new NotFoundException('Canal de notificación no encontrado');
    }

    const schema =
      await this.notificationPayloadSchemaRepository.findActiveByNotificationChannelId(
        channel.id,
      );

    if (!schema) {
      throw new NotFoundException(
        'No hay un schema activo para este canal de notificación',
      );
    }

    return {
      channelCode: channel.code,
      schemaId: schema.id,
      schemaVersion: schema.version,
      ...validatePayloadAgainstSchema(schema.schemaJson, payload),
    };
  }

  private async assertNotificationChannelExists(
    notificationChannelId?: string,
  ) {
    if (!notificationChannelId) {
      throw new BadRequestException('El canal de notificación es obligatorio');
    }

    const channel =
      await this.notificationChannelRepository.findOne(notificationChannelId);

    if (!channel) {
      throw new NotFoundException('Canal de notificación no encontrado');
    }
  }

  private assertValidConfiguration(input: {
    schemaJson?: Record<string, unknown>;
    requiredFields?: string[];
  }) {
    const validation = validateNotificationPayloadSchemaConfiguration(input);

    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Configuración de schema inválida',
        errors: validation.errors,
      });
    }
  }

  private normalizeRequiredFields(requiredFields: string[]) {
    return [...new Set(requiredFields.map((field) => field.trim()).filter(Boolean))];
  }
}
