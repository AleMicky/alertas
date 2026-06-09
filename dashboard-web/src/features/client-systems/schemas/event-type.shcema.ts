import { z } from 'zod';

export const createEventTypeSchema = z.object({
    clientSystemId: z.uuid('Sistema cliente requerido'),
    severityLevelId: z.uuid('Severidad requerida'),
    code: z.string().min(2, 'Código requerido'),
    name: z.string().min(2, 'Nombre requerido'),
    description: z.string().optional(),
    active: z.boolean(),
});

export const updateEventTypeSchema = createEventTypeSchema.partial();
export type CreateEventTypeDto = z.infer<typeof createEventTypeSchema>;
export type UpdateEventTypeDto = z.infer<typeof updateEventTypeSchema>;
export const defaultCreateEventType: CreateEventTypeDto = {
    clientSystemId: '',
    severityLevelId: '',
    code: '',
    name: '',
    description: '',
    active: true,
};