import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const defaultLoginValues: LoginDto = {
  username: '',
  password: '',
};

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Contraseña actual requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ChangePasswordDto = Pick<
  z.infer<typeof changePasswordSchema>,
  'currentPassword' | 'newPassword'
>;

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const defaultChangePasswordValues: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};
