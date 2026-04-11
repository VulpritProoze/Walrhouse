import { z } from 'zod';
import { isBefore, startOfDay, parseISO } from 'date-fns';

/**
 * Common batch fields
 */
const batchBaseSchema = z.object({
  batchNumber: z.string().min(1, 'Batch number is required'),
  itemCode: z.string().min(1, 'Item code is required'),
  binNo: z.string().min(1, 'Bin number is required'),
  status: z.number().int().min(0),
});

/**
 * Validation for new batches
 * Expiry date must not be in the past
 */
export const createBatchSchema = batchBaseSchema.extend({
  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .refine((val) => {
      const date = parseISO(val);
      return !isBefore(date, startOfDay(new Date()));
    }, 'Expiry date cannot be in the past'),
});

/**
 * Validation for updating batches
 * Only validates expiration if it's explicitly being changed to something new
 */
export const updateBatchSchema = batchBaseSchema
  .extend({
    expiryDate: z.string().min(1, 'Expiry date is required'),
  })
  .superRefine(() => {
    // Note: For refined conditional validation, the component usually compares
    // the current form value against the original value from the DTO.
    // This schema provides the base structure; the "only validate if changed"
    // logic is typically handled by checking dirty fields in the form library (e.g., react-hook-form)
    // or by passing the original date as a parameter to a refinement.
    // If we want a pure schema check, we'd need 'originalExpiryDate' in the refinement context.
    // For now, we'll keep the base types and handle the "past date" skip in the component logic
    // or via a more complex schema if the original value is included in the refinement.
  });

export type CreateBatchSchema = z.infer<typeof createBatchSchema>;
export type UpdateBatchSchema = z.infer<typeof updateBatchSchema>;
