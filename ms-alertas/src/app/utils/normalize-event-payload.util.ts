import { BadRequestException } from '@nestjs/common';

import { EventRecipient } from 'src/domain/types/event-payload.type';

import { isRecipientTargetValid } from './resolve-recipient-target.util';

export interface NormalizedEventContent {
  title: string;
  message: string;
  payloadJson: Record<string, unknown>;
}

function asRecipient(value: unknown, index: number): EventRecipient {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BadRequestException(
      `payloadJson.recipients[${index}] debe ser un objeto`,
    );
  }

  const recipient = value as EventRecipient;

  if (!recipient.channel || typeof recipient.channel !== 'string') {
    throw new BadRequestException(
      `payloadJson.recipients[${index}].channel es requerido`,
    );
  }

  if (!isRecipientTargetValid(recipient)) {
    throw new BadRequestException(
      `payloadJson.recipients[${index}] tiene un destino inválido para el canal ${recipient.channel}`,
    );
  }

  return recipient;
}

function pickFirstRecipientText(
  recipients: EventRecipient[],
  field: 'subject' | 'message',
): string | undefined {
  for (const recipient of recipients) {
    const value = recipient[field];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export function normalizeEventPayload(
  payloadJson: Record<string, unknown> | undefined,
  eventTypeCode: string,
  title?: string,
  message?: string,
): NormalizedEventContent {
  const payload = { ...(payloadJson ?? {}) };
  const rawRecipients = payload.recipients;

  if (rawRecipients !== undefined && !Array.isArray(rawRecipients)) {
    throw new BadRequestException('payloadJson.recipients debe ser un arreglo');
  }

  const recipients = Array.isArray(rawRecipients)
    ? rawRecipients.map(asRecipient)
    : [];

  payload.recipients = recipients;

  const resolvedTitle =
    title?.trim() ||
    pickFirstRecipientText(recipients, 'subject') ||
    eventTypeCode.trim();

  const resolvedMessage =
    message?.trim() ||
    pickFirstRecipientText(recipients, 'message') ||
    resolvedTitle;

  if (!resolvedTitle) {
    throw new BadRequestException(
      'Se requiere title, recipients con subject, o eventTypeCode',
    );
  }

  return {
    title: resolvedTitle,
    message: resolvedMessage,
    payloadJson: payload,
  };
}
