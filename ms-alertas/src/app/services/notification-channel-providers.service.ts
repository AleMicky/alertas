import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { buildProviderRequestHeaders } from 'src/app/utils/build-provider-request-headers.util';
import {
  ProviderConfigurationInput,
  validateNotificationChannelProviderConfiguration,
} from 'src/app/utils/validate-notification-channel-provider.util';
import { NotificationChannelProvider } from 'src/domain/entities/notification-channel-providers';
import { NotificationChannelProviderRepository } from 'src/domain/repositories/notification-channel-provider.repository';
import { NotificationChannelRepository } from 'src/domain/repositories/notification-channel.repository';
import { N8nClient } from 'src/infrastructure/integrations/n8n/n8n.client';
import { BaseService } from 'src/shared/core/base.service';

type ResolveActiveProviderInput = {
  notificationChannelId?: string;
  channelCode?: string;
  providerCode?: string;
};

@Injectable()
export class NotificationChannelProvidersService extends BaseService<NotificationChannelProvider> {
  constructor(
    private readonly notificationChannelProviderRepository: NotificationChannelProviderRepository,
    private readonly notificationChannelRepository: NotificationChannelRepository,
    private readonly n8nClient: N8nClient,
  ) {
    super(notificationChannelProviderRepository);
  }

  findAllByNotificationChannelId(notificationChannelId: string) {
    return this.notificationChannelProviderRepository.findAllByNotificationChannelId(
      notificationChannelId,
    );
  }

  findActiveByNotificationChannelId(notificationChannelId: string) {
    return this.notificationChannelProviderRepository.findActiveByNotificationChannelId(
      notificationChannelId,
    );
  }

  findDefaultByNotificationChannelId(notificationChannelId: string) {
    return this.notificationChannelProviderRepository.findDefaultByNotificationChannelId(
      notificationChannelId,
    );
  }

  findByChannelCode(channelCode: string) {
    return this.notificationChannelProviderRepository.findByChannelCode(
      channelCode,
    );
  }

  validateConfiguration(input: ProviderConfigurationInput) {
    return validateNotificationChannelProviderConfiguration(input);
  }

  async resolveActiveProvider(input: ResolveActiveProviderInput) {
    const notificationChannelId = await this.resolveNotificationChannelId(input);

    if (!notificationChannelId) {
      return null;
    }

    if (input.providerCode?.trim()) {
      return this.notificationChannelProviderRepository.findActiveByCodeAndNotificationChannelId(
        input.providerCode,
        notificationChannelId,
      );
    }

    return this.notificationChannelProviderRepository.findDefaultByNotificationChannelId(
      notificationChannelId,
    );
  }

  async create(entity: Partial<NotificationChannelProvider>) {
    this.assertValidConfiguration(entity);
    return super.create({
      ...entity,
      code: entity.code?.trim().toUpperCase(),
      active: entity.active ?? true,
      timeoutSeconds: entity.timeoutSeconds ?? 30,
      retryEnabled: entity.retryEnabled ?? true,
      maxAttempts: entity.maxAttempts ?? 3,
    });
  }

  async update(id: string, entity: Partial<NotificationChannelProvider>) {
    const current = await this.findOne(id);

    if (!current) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    this.assertValidConfiguration({
      webhookUrl: entity.webhookUrl ?? current.webhookUrl,
      authType: entity.authType ?? current.authType,
      authConfig: entity.authConfig ?? current.authConfig,
      headers: entity.headers ?? current.headers,
      timeoutSeconds: entity.timeoutSeconds ?? current.timeoutSeconds,
      maxAttempts: entity.maxAttempts ?? current.maxAttempts,
    });

    return super.update(id, entity);
  }

  async activate(id: string) {
    const provider = await this.findOne(id);

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    const validation = this.validateConfiguration(provider);

    if (!validation.valid) {
      throw new BadRequestException({
        message: 'No se puede activar un proveedor con configuración inválida',
        errors: validation.errors,
      });
    }

    await this.notificationChannelProviderRepository.deactivateAllByNotificationChannelId(
      provider.notificationChannelId,
      id,
    );

    return this.update(id, { active: true });
  }

  async deactivate(id: string) {
    const provider = await this.findOne(id);

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return this.update(id, { active: false });
  }

  async testNotificationChannelProvider(
    id: string,
    input?: {
      target?: string;
      title?: string;
      message?: string;
      payload?: Record<string, unknown>;
    },
  ) {
    const provider = await this.findOne(id);

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    const validation = this.validateConfiguration(provider);

    if (!validation.valid) {
      throw new BadRequestException({
        message: 'La configuración del proveedor no es válida',
        errors: validation.errors,
      });
    }

    const channel = await this.notificationChannelRepository.findOne(
      provider.notificationChannelId,
    );

    const payload = {
      notificationId: `test-provider-${provider.id}-${Date.now()}`,
      channel: channel?.code ?? provider.notificationChannelId,
      providerCode: provider.code,
      target: input?.target ?? 'test-target',
      title: input?.title ?? 'Prueba proveedor',
      message:
        input?.message ??
        'Mensaje enviado desde MS Alertas hacia el webhook del proveedor',
      payload: {
        test: true,
        providerId: provider.id,
        ...(input?.payload ?? {}),
      },
    };

    const response = await this.n8nClient.sendNotification(
      provider.webhookUrl,
      payload,
      {
        headers: buildProviderRequestHeaders(provider),
        timeoutMs: provider.timeoutSeconds * 1000,
      },
    );

    return {
      providerId: provider.id,
      webhookUrl: provider.webhookUrl,
      request: payload,
      response,
    };
  }

  private async resolveNotificationChannelId(
    input: ResolveActiveProviderInput,
  ): Promise<string | null> {
    if (input.notificationChannelId) {
      return input.notificationChannelId;
    }

    if (!input.channelCode?.trim()) {
      return null;
    }

    const channel = await this.notificationChannelRepository.findByRecipientChannel(
      input.channelCode,
    );

    return channel?.id ?? null;
  }

  private assertValidConfiguration(input: ProviderConfigurationInput) {
    const validation = this.validateConfiguration(input);

    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Configuración de proveedor inválida',
        errors: validation.errors,
      });
    }
  }
}
