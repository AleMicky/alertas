import { z } from 'zod';

import { isValidJsonObject } from '@/shared/utils/json-object';

import {
  buildPayloadExampleFromText,
  buildPayloadSchemaJson,
} from './notification-channel-payload.utils';

const createNotificationChannelFormSchema = z.object({
  code: z.string().min(2, 'Código requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  webhookUrl: z.url('URL inválida'),
  description: z.string().optional(),
  payloadExampleText: z
    .string()
    .optional()
    .refine((value) => !value?.trim() || isValidJsonObject(value), {
      message: 'JSON inválido',
    }),
  payloadRequired: z.record(z.string(), z.boolean()).optional(),
});

export const createNotificationChannelSchema =
  createNotificationChannelFormSchema.transform((values) => ({
    code: values.code,
    name: values.name,
    webhookUrl: values.webhookUrl,
    description: values.description,
    payloadBodyJson: buildPayloadExampleFromText(
      values.payloadExampleText ?? '',
    ),
    payloadSchemaJson: buildPayloadSchemaJson(values.payloadRequired),
  }));

export const updateNotificationChannelSchema =
  createNotificationChannelFormSchema
    .omit({ code: true })
    .partial()
    .transform((values) => ({
      name: values.name,
      webhookUrl: values.webhookUrl,
      description: values.description,
      payloadBodyJson: values.payloadExampleText
        ? buildPayloadExampleFromText(values.payloadExampleText)
        : undefined,
      payloadSchemaJson: values.payloadRequired
        ? buildPayloadSchemaJson(values.payloadRequired)
        : undefined,
    }));

export type CreateNotificationChannelFormValues = z.input<
  typeof createNotificationChannelFormSchema
>;
export type CreateNotificationChannelDto = z.output<
  typeof createNotificationChannelSchema
>;
export type UpdateNotificationChannelDto = z.infer<
  typeof updateNotificationChannelSchema
>;

export const defaultCreateNotificationChannel: CreateNotificationChannelFormValues =
  {
    code: '',
    name: '',
    webhookUrl: '',
    description: '',
    payloadExampleText: '',
    payloadRequired: {},
  };
