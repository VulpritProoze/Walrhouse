import { z } from 'zod';

export const CreateBinSchema = z.object({
  binNo: z
    .string()
    .min(1, 'Bin Number is required')
    .max(64, 'Bin Number must not exceed 64 characters')
    .regex(
      /^[A-Z0-9_-]+$/,
      'Bin Number can only contain uppercase letters, numbers, hyphens and underscores',
    ),
  binName: z
    .string()
    .min(1, 'Bin Name is required')
    .max(256, 'Bin Name must not exceed 256 characters'),
  warehouseCode: z.string().min(1, 'Warehouse Code is required'),
});

export const UpdateBinSchema = z.object({
  binName: z
    .string()
    .min(1, 'Bin Name is required')
    .max(256, 'Bin Name must not exceed 256 characters'),
  warehouseCode: z.string().min(1, 'Warehouse Code is required'),
});

export type CreateBinInput = z.infer<typeof CreateBinSchema>;
export type UpdateBinInput = z.infer<typeof UpdateBinSchema>;
