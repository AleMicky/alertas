import { BadRequestException } from '@nestjs/common';

import { NotificationChannel } from 'src/domain/entities/notification-channel';
import { EventRecipient } from 'src/domain/types/event-payload.type';

import { isRecipientTargetValid } from './resolve-recipient-target.util';

const RECIPIENT_META_FIELDS = new Set(['channel']);

export function getChannelRequiredFields(
  channel: NotificationChannel,
): string[] {
  const required = channel.payloadSchemaJson?.required;

  if (!Array.isArray(required)) {
    return [];
  }

  return required.filter((field): field is string => typeof field === 'string');
}

export function getChannelPayloadFieldKeys(
  channel: NotificationChannel,
): string[] {
  const body = channel.payloadBodyJson;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return [];
  }

  return Object.keys(body);
}

export function isPayloadFieldPresent(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
}

function isTypePlaceholder(value: unknown): boolean {
  return value === 'string' || value === 'number' || value === 'boolean';
}

function getTemplateDefaultValue(templateValue: unknown): unknown | undefined {
  if (isTypePlaceholder(templateValue)) {
    return undefined;
  }

  if (Array.isArray(templateValue) && templateValue.length === 0) {
    return [];
  }

  if (
    typeof templateValue === 'object' &&
    templateValue !== null &&
    !Array.isArray(templateValue) &&
    Object.keys(templateValue).length === 0
  ) {
    return {};
  }

  return undefined;
}

export function applyChannelPayloadDefaults(
  recipient: Record<string, unknown>,
  channel: NotificationChannel,
): Record<string, unknown> {
  const body = channel.payloadBodyJson;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ...recipient };
  }

  const next = { ...recipient };

  for (const [field, templateValue] of Object.entries(body)) {
    if (next[field] !== undefined) {
      continue;
    }

    const defaultValue = getTemplateDefaultValue(templateValue);

    if (defaultValue !== undefined) {
      next[field] = defaultValue;
    }
  }

  return next;
}

export function normalizeRecipientPayload(
  recipient: Record<string, unknown>,
  channel: NotificationChannel,
  index: number,
): EventRecipient {
  const { provider: _provider, ...recipientWithoutProvider } = recipient;
  const channelCode =
    typeof recipientWithoutProvider.channel === 'string'
      ? recipientWithoutProvider.channel
      : channel.code;

  if (!channelCode.trim()) {
    throw new BadRequestException(
      `payloadJson.recipients[${index}].channel es requerido`,
    );
  }

  const withDefaults = applyChannelPayloadDefaults(
    recipientWithoutProvider,
    channel,
  );
  const requiredFields = getChannelRequiredFields(channel);
  const allowedPayloadFields = new Set(getChannelPayloadFieldKeys(channel));

  for (const field of requiredFields) {
    if (!isPayloadFieldPresent(withDefaults[field])) {
      throw new BadRequestException(
        `payloadJson.recipients[${index}].${field} es requerido para el canal ${channelCode}`,
      );
    }
  }

  const normalizedRecipient = {
    ...withDefaults,
    channel: channel.code,
  } as EventRecipient;

  if (
    requiredFields.length === 0 &&
    !isRecipientTargetValid(normalizedRecipient, channel)
  ) {
    throw new BadRequestException(
      `payloadJson.recipients[${index}] tiene un destino inválido para el canal ${channelCode}`,
    );
  }

  if (allowedPayloadFields.size > 0) {
    for (const field of Object.keys(withDefaults)) {
      if (
        RECIPIENT_META_FIELDS.has(field) ||
        allowedPayloadFields.has(field)
      ) {
        continue;
      }

      throw new BadRequestException(
        `payloadJson.recipients[${index}].${field} no está permitido para el canal ${channel.code}`,
      );
    }
  }

  return normalizedRecipient;
}
