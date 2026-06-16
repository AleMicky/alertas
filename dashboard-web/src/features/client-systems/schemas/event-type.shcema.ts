import { z } from 'zod';

export const createEventTypeSchema = z.object({
    clientSystemId: z.uuid('Sistema cliente requerido'),
    code: z.string().min(2, 'Código requerido'),
    name: z.string().min(2, 'Nombre requerido'),
    description: z.string().optional(),
});

export const updateEventTypeSchema = createEventTypeSchema
    .omit({ clientSystemId: true })
    .partial();
export type CreateEventTypeDto = z.infer<typeof createEventTypeSchema>;
export type UpdateEventTypeDto = z.infer<typeof updateEventTypeSchema>;
export const defaultCreateEventType: CreateEventTypeDto = {
    clientSystemId: '',
    code: '',
    name: '',
    description: '',
};
