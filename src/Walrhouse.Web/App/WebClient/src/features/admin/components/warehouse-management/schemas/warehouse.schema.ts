import { z } from 'zod';

export const CreateWarehouseSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(64, 'Code must not exceed 64 characters')
    .regex(
      /^[A-Z0-9_-]+$/,
      'Code can only contain uppercase letters, numbers, hyphens and underscores',
    ),
  name: z.string().min(1, 'Name is required').max(256, 'Name must not exceed 256 characters'),
});

export const UpdateWarehouseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(256, 'Name must not exceed 256 characters'),
});

export type CreateWarehouseInput = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof UpdateWarehouseSchema>;
