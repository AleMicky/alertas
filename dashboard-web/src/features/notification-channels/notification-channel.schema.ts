import { z } from 'zod';

export const createNotificationChannelSchema = z.object({
    code: z.string().min(2, 'Código requerido'),
    name: z.string().min(2, 'Nombre requerido'),
    webhookUrl: z.url('URL inválida'),
    description: z.string().optional(),
});

export const updateNotificationChannelSchema =
    createNotificationChannelSchema.omit({ code: true }).partial();

export type CreateNotificationChannelDto = z.infer<typeof createNotificationChannelSchema>;
export type UpdateNotificationChannelDto = z.infer<typeof updateNotificationChannelSchema>;

export const defaultCreateNotificationChannel: CreateNotificationChannelDto = {
    code: '',
    name: '',
    webhookUrl: '',
    description: '',
};
