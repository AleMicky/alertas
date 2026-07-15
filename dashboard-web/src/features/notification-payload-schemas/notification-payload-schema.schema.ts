import { z } from 'zod';

import {
  formatRequiredFieldsText,
  getRequiredFieldsFromSchema,
  normalizeSchemaJson,
  parseJsonObject,
  parseOptionalJsonObject,
  parseRequiredFieldsText,
  requiredFieldsMatchSchema,
} from './notification-payload-schema.utils';
import { NotificationPayloadSchema } from './notification-payload-schema.types';

const payloadSchemaFormSchema = z.object({
  notificationChannelId: z.string().uuid('Selecciona un canal'),
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  version: z.number().int().min(1).optional(),
  schemaJsonText: z.string().min(2, 'Schema JSON requerido'),
  exampleJsonText: z.string().optional(),
  requiredFieldsText: z.string().min(1, 'Indica al menos un campo requerido'),
  active: z.boolean().optional(),
});

export const createNotificationPayloadSchemaFormSchema =
  payloadSchemaFormSchema.superRefine((values, context) => {
    let schemaJson: Record<string, unknown>;

    try {
      schemaJson = parseJsonObject(values.schemaJsonText, 'schemaJson');
    } catch (error) {
      context.addIssue({
        code: 'custom',
        message:
          error instanceof Error ? error.message : 'schemaJson inválido',
        path: ['schemaJsonText'],
      });
      return;
    }

    try {
      parseOptionalJsonObject(values.exampleJsonText, 'example');
    } catch (error) {
      context.addIssue({
        code: 'custom',
        message: error instanceof Error ? error.message : 'example inválido',
        path: ['exampleJsonText'],
      });
    }

    const schemaRequired = getRequiredFieldsFromSchema(schemaJson);
    const requiredFields =
      schemaRequired.length > 0
        ? schemaRequired
        : parseRequiredFieldsText(values.requiredFieldsText);

    if (requiredFields.length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'Indica al menos un campo requerido',
        path: ['requiredFieldsText'],
      });
      return;
    }

    if (!requiredFieldsMatchSchema(schemaJson, requiredFields)) {
      context.addIssue({
        code: 'custom',
        message: `Los campos obligatorios no coinciden (${schemaRequired.join(', ') || 'ninguno'}). Revisa el editor de campos.`,
        path: ['requiredFieldsText'],
      });
    }
  });

/** Validación al editar: canal/nombre/versión no bloquean el guardado. */
export const updateNotificationPayloadSchemaFormSchema = z
  .object({
    description: z.string().optional(),
    schemaJsonText: z.string().min(2, 'Schema JSON requerido'),
    exampleJsonText: z.string().optional(),
    requiredFieldsText: z.string().min(1, 'Indica al menos un campo requerido'),
    active: z.boolean().optional(),
    notificationChannelId: z.string().optional(),
    name: z.string().optional(),
    version: z.number().int().min(1).optional(),
  })
  .superRefine((values, context) => {
    let schemaJson: Record<string, unknown>;

    try {
      schemaJson = parseJsonObject(values.schemaJsonText, 'schemaJson');
    } catch (error) {
      context.addIssue({
        code: 'custom',
        message:
          error instanceof Error ? error.message : 'schemaJson inválido',
        path: ['schemaJsonText'],
      });
      return;
    }

    try {
      parseOptionalJsonObject(values.exampleJsonText, 'example');
    } catch (error) {
      context.addIssue({
        code: 'custom',
        message: error instanceof Error ? error.message : 'example inválido',
        path: ['exampleJsonText'],
      });
    }

    const schemaRequired = getRequiredFieldsFromSchema(schemaJson);
    const requiredFields =
      schemaRequired.length > 0
        ? schemaRequired
        : parseRequiredFieldsText(values.requiredFieldsText ?? '');

    if (requiredFields.length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'Indica al menos un campo requerido',
        path: ['requiredFieldsText'],
      });
      return;
    }

    if (!requiredFieldsMatchSchema(schemaJson, requiredFields)) {
      context.addIssue({
        code: 'custom',
        message: `Los campos obligatorios no coinciden (${schemaRequired.join(', ') || 'ninguno'}). Revisa el editor de campos.`,
        path: ['requiredFieldsText'],
      });
    }
  });

export type NotificationPayloadSchemaFormValues = z.infer<
  typeof payloadSchemaFormSchema
>;

export type CreateNotificationPayloadSchemaDto = {
  notificationChannelId: string;
  name: string;
  description?: string | null;
  version?: number;
  schemaJson: Record<string, unknown>;
  example?: Record<string, unknown> | null;
  requiredFields: string[];
  active?: boolean;
};

export type UpdateNotificationPayloadSchemaDto = Partial<
  Omit<
    CreateNotificationPayloadSchemaDto,
    'notificationChannelId' | 'name' | 'version'
  >
>;

export const defaultNotificationPayloadSchemaForm: NotificationPayloadSchemaFormValues =
  {
    notificationChannelId: '',
    name: '',
    description: '',
    version: undefined,
    schemaJsonText: '',
    exampleJsonText: '',
    requiredFieldsText: '',
    active: true,
  };

function toApiDto(
  values: NotificationPayloadSchemaFormValues,
): CreateNotificationPayloadSchemaDto {
  const schemaJson = parseJsonObject(values.schemaJsonText, 'schemaJson');
  const schemaRequired = getRequiredFieldsFromSchema(schemaJson);
  const requiredFields =
    schemaRequired.length > 0
      ? schemaRequired
      : parseRequiredFieldsText(values.requiredFieldsText);

  return {
    notificationChannelId: values.notificationChannelId,
    name: values.name.trim(),
    description: values.description?.trim() || null,
    version: values.version,
    schemaJson,
    example: parseOptionalJsonObject(values.exampleJsonText, 'example'),
    requiredFields,
    active: values.active ?? true,
  };
}

export function toCreateNotificationPayloadSchemaDto(
  values: NotificationPayloadSchemaFormValues,
): CreateNotificationPayloadSchemaDto {
  const parsed = createNotificationPayloadSchemaFormSchema.parse(values);
  return toApiDto(parsed);
}

export function toUpdateNotificationPayloadSchemaDto(
  values: NotificationPayloadSchemaFormValues,
): UpdateNotificationPayloadSchemaDto {
  // En update no revalidamos canal/nombre/versión (son inmutables).
  const schemaJson = parseJsonObject(values.schemaJsonText, 'schemaJson');
  const schemaRequired = getRequiredFieldsFromSchema(schemaJson);
  const requiredFields =
    schemaRequired.length > 0
      ? schemaRequired
      : parseRequiredFieldsText(values.requiredFieldsText);

  if (requiredFields.length === 0) {
    throw new Error('Indica al menos un campo requerido en el schema');
  }

  if (!requiredFieldsMatchSchema(schemaJson, requiredFields)) {
    throw new Error(
      `Los campos obligatorios no coinciden (${schemaRequired.join(', ') || 'ninguno'})`,
    );
  }

  try {
    parseOptionalJsonObject(values.exampleJsonText, 'example');
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'example inválido',
    );
  }

  return {
    description: values.description?.trim() || null,
    schemaJson,
    example: parseOptionalJsonObject(values.exampleJsonText, 'example'),
    requiredFields,
  };
}

export function schemaToFormValues(
  schema: NotificationPayloadSchema,
): NotificationPayloadSchemaFormValues {
  const schemaJson =
    normalizeSchemaJson(schema.schemaJson) ?? schema.schemaJson;

  return {
    notificationChannelId: schema.notificationChannelId,
    name: schema.name,
    description: schema.description ?? '',
    version: schema.version,
    schemaJsonText: JSON.stringify(schemaJson, null, 2),
    exampleJsonText: schema.example
      ? JSON.stringify(schema.example, null, 2)
      : '',
    requiredFieldsText: formatRequiredFieldsText(schema.requiredFields ?? []),
    active: schema.active,
  };
}
