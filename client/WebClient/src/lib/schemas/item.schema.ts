import { z } from "zod";

export const itemGroupSchema = z.number().int().nonnegative();

export const itemSchema = z.object({
  itemCode: z.string().min(1).max(50),
  itemName: z.string().min(1).max(200),
  barcode: z.string().max(100).nullable().optional(),
  itemGroup: itemGroupSchema,
});

export const getItemsResponseSchema = z.object({
  items: z.array(itemSchema),
  pageNumber: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  totalCount: z.number().int().nonnegative(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export type Item = z.infer<typeof itemSchema>;
export type GetItemsResponse = z.infer<typeof getItemsResponseSchema>;
