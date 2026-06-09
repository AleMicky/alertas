import { z } from 'zod';

export const createSeverityLevelSchema =
  z.object({
    code: z.string().min(2, 'Código requerido'),
    name: z.string().min(2, 'Nombre requerido'),
    description: z.string().optional(),
    priority: z.number().min(1, 'Prioridad mínima 1'),
    attentionTimeMinutes: z.number().min(1).optional(),
    active: z.boolean(),
  });

export const updateSeverityLevelSchema = createSeverityLevelSchema.partial();
export type CreateSeverityLevelDto = z.infer<typeof createSeverityLevelSchema>;
export type UpdateSeverityLevelDto = z.infer<typeof updateSeverityLevelSchema>;

export const defaultCreateSeverityLevel: CreateSeverityLevelDto = {
  code: '',
  name: '',
  description: '',
  priority: 1,
  attentionTimeMinutes: 60,
  active: true,
};