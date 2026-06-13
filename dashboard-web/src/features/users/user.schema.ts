import { z } from 'zod';

export const userFormSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string(),
  fullName: z.string().min(2, 'Nombre requerido'),
  roles: z.array(z.string()).min(1, 'Selecciona al menos un rol'),
});

export const createUserSchema = userFormSchema.extend({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const updateUserSchema = userFormSchema;

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const defaultCreateUser: CreateUserDto = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  roles: [],
};
