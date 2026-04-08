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
 * POST /api/Warehouses
 */
export const createWarehouse = async (data: CreateWarehouseRequest) => {
  return await api.post('/api/Warehouses', data);
};

/**
 * Get paginated list of warehouses.
 * GET /api/Warehouses
 */
export const getWarehouses = async (params?: GetWarehousesRequest) => {
  return await api.get('/api/Warehouses', { params });
};

/**
 * Get a single warehouse by code.
 * GET /api/Warehouses/{warehouseCode}
 */
export const getWarehouse = async (warehouseCode: string) => {
  return await api.get(`/api/Warehouses/${warehouseCode}`);
};

/**
 * Update an existing warehouse.
 * PUT /api/Warehouses/{warehouseCode}
 */
export const updateWarehouse = async (warehouseCode: string, data: UpdateWarehouseRequest) => {
  return await api.put(`/api/Warehouses/${warehouseCode}`, data);
};

/**
 * Soft-delete a warehouse by code.
 * DELETE /api/Warehouses/{warehouseCode}
 */
export const deleteWarehouse = async (warehouseCode: string) => {
  return await api.delete(`/api/Warehouses/${warehouseCode}`);
};
