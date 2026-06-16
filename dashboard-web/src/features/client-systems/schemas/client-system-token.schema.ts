import { z } from 'zod';

export const generateClientSystemTokenSchema = z.object({
    expiresAt: z.string().optional(),
});

export type GenerateClientSystemTokenDto = z.infer<typeof generateClientSystemTokenSchema>;
export const defaultGenerateClientSystemToken: GenerateClientSystemTokenDto = {
    expiresAt: '',
};
