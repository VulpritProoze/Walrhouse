import { z } from 'zod';

export const uomGroupLineSchema = z.object({
  uoM: z.string().min(1, 'UoM Name is required'),
  baseQty: z.number().min(1, 'Quantity must be at least 1'),
});

export const uomGroupSchema = z.object({
  baseUoM: z.string().min(1, 'Base UoM is required'),
  uoMGroupLines: z.array(uomGroupLineSchema).min(1, 'At least one conversion line is required'),
});

export type UoMGroupFormValues = z.infer<typeof uomGroupSchema>;
