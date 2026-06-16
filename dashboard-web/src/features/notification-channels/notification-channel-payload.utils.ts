import { formatJsonObject } from '@/shared/utils/json-object';

import { CreateNotificationChannelFormValues, defaultCreateNotificationChannel } from './notification-channel.schema';
import { NotificationChannel } from './notification-channel.types';

export type PayloadRequiredMap = Record<string, boolean>;

function normalizeJsonField(value: unknown): Record<string, unknown> | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);

      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return undefined;
    }
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

export function normalizeNotificationChannel(
  channel?: NotificationChannel | null,
): NotificationChannel | null {
  if (!channel) {
    return null;
  }

  return {
    ...channel,
    webhookUrl: channel.webhookUrl ?? channel.webhook_url ?? '',
    payloadExampleJson:
      normalizeJsonField(channel.payloadExampleJson) ??
      normalizeJsonField(channel.payload_example_json),
    payloadSchemaJson:
      normalizeJsonField(channel.payloadSchemaJson) ??
      normalizeJsonField(channel.payload_schema_json),
  };
}

export function parsePayloadExampleText(
  text: string,
): Record<string, unknown> | null {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function valueToEditableString(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

export function editableStringToValue(original: unknown, text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    if (Array.isArray(original)) {
      return [];
    }

    if (typeof original === 'object' && original !== null) {
      return {};
    }

    return '';
  }

  if (typeof original === 'number') {
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? trimmed : parsed;
  }

  if (typeof original === 'boolean') {
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    return trimmed;
  }

  if (Array.isArray(original) || (typeof original === 'object' && original !== null)) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

export function buildPayloadExampleFromText(text: string) {
  return parsePayloadExampleText(text) ?? undefined;
}

export function buildPayloadSchemaJson(required: PayloadRequiredMap | undefined) {
  if (!required) {
    return undefined;
  }

  const requiredFields = Object.entries(required)
    .filter(([, isRequired]) => isRequired)
    .map(([key]) => key);

  if (requiredFields.length === 0) {
    return undefined;
  }

  return { required: requiredFields };
}

export function updatePayloadExampleField(
  text: string,
  key: string,
  nextValue: string,
) {
  const current = parsePayloadExampleText(text);

  if (!current || !(key in current)) {
    return text;
  }

  const updated = {
    ...current,
    [key]: editableStringToValue(current[key], nextValue),
  };

  return formatJsonObject(updated);
}

export function syncPayloadRequiredKeys(
  required: PayloadRequiredMap,
  keys: string[],
): PayloadRequiredMap {
  const next: PayloadRequiredMap = {};

  for (const key of keys) {
    next[key] = required[key] ?? false;
  }

  return next;
}

export function parsePayloadFromChannel(channel?: NotificationChannel | null) {
  const normalized = normalizeNotificationChannel(channel);
  const example = normalized?.payloadExampleJson ?? null;
  const requiredList = Array.isArray(normalized?.payloadSchemaJson?.required)
    ? (normalized.payloadSchemaJson.required as string[])
    : [];

  const payloadExampleText = formatJsonObject(example ?? undefined);
  const parsed = parsePayloadExampleText(payloadExampleText);
  const keys = parsed ? Object.keys(parsed) : [];

  const payloadRequired = syncPayloadRequiredKeys(
    Object.fromEntries(requiredList.map((key) => [key, true])),
    keys,
  );

  return {
    payloadExampleText,
    payloadRequired,
  };
}

export function buildNotificationChannelFormValues(
  channel?: NotificationChannel | null,
): CreateNotificationChannelFormValues {
  const normalized = normalizeNotificationChannel(channel);

  if (!normalized) {
    return defaultCreateNotificationChannel;
  }

  const { payloadExampleText, payloadRequired } =
    parsePayloadFromChannel(normalized);

  return {
    code: normalized.code ?? '',
    name: normalized.name ?? '',
    webhookUrl: normalized.webhookUrl ?? '',
    description: normalized.description ?? '',
    payloadExampleText,
    payloadRequired,
  };
}

export function getNotificationChannelPayloadSummary(
  channel: NotificationChannel,
) {
  const normalized = normalizeNotificationChannel(channel);
  const example = normalized?.payloadExampleJson ?? {};
  const fieldKeys = Object.keys(example);
  const requiredList = Array.isArray(normalized?.payloadSchemaJson?.required)
    ? (normalized.payloadSchemaJson.required as string[])
    : [];

  return {
    fieldCount: fieldKeys.length,
    requiredCount: requiredList.length,
    fieldKeys,
    requiredList,
    hasPayload: fieldKeys.length > 0,
    previewKeys: fieldKeys.slice(0, 3),
  };
}

export function formatNotificationChannelPayloadPreview(
  channel: NotificationChannel,
) {
  const { previewKeys, fieldCount } =
    getNotificationChannelPayloadSummary(channel);

  if (fieldCount === 0) {
    return 'Sin body';
  }

  const preview = previewKeys.join(', ');
  const remaining = fieldCount - previewKeys.length;

  if (remaining > 0) {
    return `${preview} +${remaining}`;
  }

  return preview;
}
