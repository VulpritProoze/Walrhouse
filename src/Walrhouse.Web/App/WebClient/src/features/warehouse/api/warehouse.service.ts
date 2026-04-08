import { api } from '@/lib/axios';

/**
 * Request payload for creating a new warehouse.
 */
export interface CreateWarehouseRequest {
  warehouseCode: string;
  warehouseName: string;
}

/**
 * Request parameters for getting paginated list of warehouses.
 */
export interface GetWarehousesRequest {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Request payload for updating an existing warehouse.
 */
export interface UpdateWarehouseRequest {
  warehouseName: string | null;
}

/**
 * Create a new warehouse; returns the warehouse code.
 * POST /api/Warehouse
 */
export const createWarehouse = async (data: CreateWarehouseRequest) => {
  return await api.post<string>('/Warehouse', data);
};

/**
 * Get paginated list of warehouses.
 * GET /api/Warehouse
 */
export const getWarehouses = async (params?: GetWarehousesRequest) => {
  return await api.get('/Warehouse', { params });
};

/**
 * Get a single warehouse by code.
 * GET /api/Warehouse/{warehouseCode}
 */
export const getWarehouse = async (warehouseCode: string) => {
  return await api.get(`/Warehouse/${warehouseCode}`);
};

/**
 * Update an existing warehouse.
 * PUT /api/Warehouse/{warehouseCode}
 */
export const updateWarehouse = async (warehouseCode: string, data: UpdateWarehouseRequest) => {
  return await api.put(`/Warehouse/${warehouseCode}`, data);
};

/**
 * Soft-delete a warehouse by code.
 * DELETE /api/Warehouse/{warehouseCode}
 */
export const deleteWarehouse = async (warehouseCode: string) => {
  return await api.delete(`/Warehouse/${warehouseCode}`);
};
