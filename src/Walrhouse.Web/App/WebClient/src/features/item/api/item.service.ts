import { api } from '@/lib/axios';
import { type ItemGroup, type BarcodeFormat } from '../types';

/**
 * Request payload for creating a new item.
 */
export interface CreateItemRequest {
  itemCode: string;
  itemName: string;
  uoMGroupId: number;
  barcodeValue?: string | null;
  barcodeFormat?: BarcodeFormat | null;
  itemGroup?: ItemGroup | null;
  remarks?: string | null;
}

/**
 * Request parameters for getting paginated list of items.
 */
export interface GetItemsRequest {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

/**
 * Request payload for updating an existing item.
 */
export interface UpdateItemRequest {
  itemName?: string | null;
  uoMGroupId?: number | null;
  barcodeValue?: string | null;
  barcodeFormat?: BarcodeFormat | null;
  itemGroup?: ItemGroup | null;
  remarks?: string | null;
}

/**
 * Create a new item; returns the item code.
 * POST /api/Items
 */
export const createItem = async (data: CreateItemRequest) => {
  return await api.post<string>('/Items', data);
};

/**
 * Get paginated list of items.
 * GET /api/Items
 */
export const getItems = async (params?: GetItemsRequest) => {
  return await api.get('/Items', { params });
};

/**
 * Get a single item by code.
 * GET /api/Items/{itemCode}
 */
export const getItem = async (itemCode: string) => {
  return await api.get(`/Items/${itemCode}`);
};

/**
 * Update an existing item.
 * PUT /api/Items/{itemCode}
 */
export const updateItem = async (itemCode: string, data: UpdateItemRequest) => {
  return await api.put(`/Items/${itemCode}`, data);
};

/**
 * Soft-delete an item by code.
 * DELETE /api/Items/{itemCode}
 */
export const deleteItem = async (itemCode: string) => {
  return await api.delete(`/Items/${itemCode}`);
};
