import { z } from 'zod';

export const createRoleSchema = z.object({
  code: z.string().min(2, 'Código requerido'),
  name: z.string().min(2, 'Nombre requerido'),
});

export const updateRoleSchema = createRoleSchema.partial();

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;

export const defaultCreateRole: CreateRoleDto = {
  code: '',
  name: '',
};
