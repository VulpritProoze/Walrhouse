import { api } from '@/lib/axios';

// Request/Response DTOs (minimal inferred shapes)
export interface CreateBatchRequest {
  batchNumber: string;
  itemCode: string;
  expiryDate: string; // ISO datetime
  status?: number; // BatchStatus enum as number
  binNo?: string;
}

export interface UpdateBatchRequest {
  itemCode?: string | null;
  expiryDate?: string | null; // ISO datetime
  status?: number | null;
  binNo?: string | null;
}

export interface GetBatchesParams {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Create a new batch. Returns the created batch number.
 * POST Batch
 */
export const createBatch = (payload: CreateBatchRequest) => {
  return api.post<string>('Batch', payload);
};

/**
 * Get paginated batches.
 * GET Batch?pageNumber=...&pageSize=...
 */
export const getBatches = (params?: GetBatchesParams) => {
  return api.get('Batch', { params });
};

/**
 * Get a single batch by batch number.
 * GET Batch/{batchNumber}
 */
export const getBatch = (batchNumber: string) => {
  return api.get(`Batch/${encodeURIComponent(batchNumber)}`);
};

/**
 * Update an existing batch.
 * PUT Batch/{batchNumber}
 */
export const updateBatch = (batchNumber: string, payload: UpdateBatchRequest) => {
  return api.put(`Batch/${encodeURIComponent(batchNumber)}`, payload);
};

/**
 * Soft-delete a batch by batch number.
 * DELETE Batch/{batchNumber}
 */
export const deleteBatch = (batchNumber: string) => {
  return api.delete(`Batch/${encodeURIComponent(batchNumber)}`);
};
