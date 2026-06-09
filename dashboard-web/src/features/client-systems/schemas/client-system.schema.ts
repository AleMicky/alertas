import { z } from 'zod';

export const createClientSystemSchema = z.object({
    code: z.string().min(2, 'Código requerido'),
    name: z.string().min(2, 'Nombre requerido'),
    description: z.string().optional(),
    active: z.boolean(),
});

export const updateClientSystemSchema = createClientSystemSchema.partial();
export type CreateClientSystemDto = z.infer<typeof createClientSystemSchema>;
export type UpdateClientSystemDto = z.infer<typeof updateClientSystemSchema>;
export const defaultCreateClientSystem: CreateClientSystemDto = {
    code: '',
    name: '',
    description: '',
    active: true,
};