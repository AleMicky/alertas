import { z } from 'zod';
import { NotificationChannelType } from './notification-channel.types';
export const createNotificationChannelSchema =
    z.object({
        code: z.string().min(2, 'Código requerido'),
        name: z.string().min(2, 'Nombre requerido'),
        type: z.enum(NotificationChannelType, { message: 'Tipo requerido' }),
        webhookUrl: z.url('URL inválida'),
        description: z.string().optional(),
        active: z.boolean(),
    });

export const updateNotificationChannelSchema = createNotificationChannelSchema.partial();
export type CreateNotificationChannelDto = z.infer<typeof createNotificationChannelSchema>;
export type UpdateNotificationChannelDto = z.infer<typeof updateNotificationChannelSchema>;
export const defaultCreateNotificationChannel: CreateNotificationChannelDto = {
    code: '',
    name: '',
    type: NotificationChannelType.EMAIL,
    webhookUrl: '',
    description: '',
    active: true,
};