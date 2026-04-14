import { z } from 'zod';

export const orderLineSchema = z.object({
  itemCode: z.string().min(1, 'Item code is required'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  orderedQty: z.number().int().positive('Quantity must be greater than 0'),
});

export const createSalesOrderSchema = z.object({
  customerName: z
    .string()
    .max(256, 'Customer name must be less than 256 characters')
    .optional()
    .nullable(),
  dueDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), 'Invalid date format')
    .refine((date) => {
      if (!date) return true;
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, 'Due date cannot be in the past')
    .optional()
    .nullable(),
  remarks: z.string().max(1024, 'Remarks must be less than 1024 characters').optional().nullable(),
  orderLines: z.array(orderLineSchema).min(1, 'At least one order line is required'),
});

export const updateSalesOrderSchema = z.object({
  id: z.number(),
  status: z.number(),
  customerName: z
    .string()
    .max(256, 'Customer name must be less than 256 characters')
    .optional()
    .nullable(),
  dueDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), 'Invalid date format')
    .optional()
    .nullable(),
  remarks: z.string().max(1024, 'Remarks must be less than 1024 characters').optional().nullable(),
  orderLines: z.array(orderLineSchema).min(1, 'At least one order line is required'),
});

export type CreateSalesOrderSchema = z.infer<typeof createSalesOrderSchema>;
export type UpdateSalesOrderSchema = z.infer<typeof updateSalesOrderSchema>;
export type OrderLineSchema = z.infer<typeof orderLineSchema>;
