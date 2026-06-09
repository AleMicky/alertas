import { z } from 'zod';

export const createClientSystemTokenSchema = z.object({
    clientSystemId: z.uuid('Sistema cliente requerido'),
    description: z.string().optional(),
    expiresAt: z.string().optional(),
    active: z.boolean(),
});

export const updateClientSystemTokenSchema = createClientSystemTokenSchema.partial();
export type CreateClientSystemTokenDto = z.infer<typeof createClientSystemTokenSchema>;
export type UpdateClientSystemTokenDto = z.infer<typeof updateClientSystemTokenSchema>;
export const defaultCreateClientSystemToken: CreateClientSystemTokenDto = {
    clientSystemId: '',
    description: '',
    expiresAt: '',
    active: true,
};