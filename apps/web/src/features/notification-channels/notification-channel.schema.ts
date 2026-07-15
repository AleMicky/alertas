import { z } from 'zod';

export const createNotificationChannelSchema = z.object({
  code: z.string().min(2, 'Código requerido'),
  name: z.string().min(2, 'Nombre requerido'),
});

export const updateNotificationChannelSchema =
  createNotificationChannelSchema.omit({ code: true }).partial();

export type CreateNotificationChannelFormValues = z.infer<
  typeof createNotificationChannelSchema
>;
export type CreateNotificationChannelDto = CreateNotificationChannelFormValues;
export type UpdateNotificationChannelDto = z.infer<
  typeof updateNotificationChannelSchema
>;

export const defaultCreateNotificationChannel: CreateNotificationChannelFormValues =
  {
    code: '',
    name: '',
  };
