import { api } from '@/lib/axios';
import { type PaginatedList } from '@/lib/types/paginated-list';
import type { OrderStatus } from '../types';

/**
 * Request payload for an order line.
 */
export interface OrderLineDto {
  docEntry?: string;
  batchNumbers: string[];
}

/**
 * Domain DTO for a sales order.
 */
export interface SalesOrderDto {
  id: number;
  dueDate: string | null;
  status: OrderStatus | null;
  closedBy: string | null;
  customerName: string | null;
  remarks: string | null;
  orderLines: OrderLineDto[];
}

/**
 * Response type for paginated sales orders.
 */
export type GetSalesOrdersResponse = PaginatedList<SalesOrderDto>;

/**
 * Request payload for creating a new sales order.
 */
export interface CreateSalesOrderRequest {
  dueDate?: string | null;
  customerName?: string | null;
  remarks?: string | null;
  orderLines: OrderLineDto[];
}

/**
 * Request parameters for getting paginated list of sales orders.
 */
export interface GetSalesOrdersRequest {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Request payload for updating an existing sales order.
 */
export interface UpdateSalesOrderRequest {
  id: number;
  dueDate?: string | null;
  status?: OrderStatus | null;
  customerName?: string | null;
  remarks?: string | null;
  orderLines?: OrderLineDto[] | null;
}

/**
 * Create a new sales order; returns the order ID.
 * POST /api/SalesOrder
 */
export const createSalesOrder = async (data: CreateSalesOrderRequest) => {
  return await api.post<number>('/SalesOrder', data);
};

/**
 * Get paginated list of sales orders.
 * GET /api/SalesOrder
 */
export const getSalesOrders = async (params?: GetSalesOrdersRequest) => {
  return await api.get<GetSalesOrdersResponse>('/SalesOrder', { params });
};

/**
 * Get a single sales order by ID.
 * GET /api/SalesOrder/{id}
 */
export const getSalesOrder = async (id: number) => {
  return await api.get<SalesOrderDto>(`/SalesOrder/${id}`);
};

/**
 * Update an existing sales order.
 * PUT /api/SalesOrder/{id}
 */
export const updateSalesOrder = async (id: number, data: UpdateSalesOrderRequest) => {
  return await api.put(`/SalesOrder/${id}`, data);
};

/**
 * Delete a sales order by ID.
 * DELETE /api/SalesOrder/{id}
 */
export const deleteSalesOrder = async (id: number) => {
  return await api.delete(`/SalesOrder/${id}`);
};
