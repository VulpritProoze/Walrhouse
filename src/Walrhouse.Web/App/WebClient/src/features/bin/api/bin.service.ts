import { api } from '@/lib/axios';

/** Request payload for creating a new bin. */
export interface CreateBinRequest {
  binNo: string;
  binName: string;
  warehouseCode: string;
}

/** Request payload for updating an existing bin. Fields may be null to indicate no change. */
export interface UpdateBinRequest {
  binName: string | null;
  warehouseCode: string | null;
}

/** Query params for listing bins. */
export interface GetBinsRequest {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Create a new bin; returns the bin number.
 * POST /api/Bin
 */
export const createBin = (data: CreateBinRequest) => api.post<string>('/Bin', data);

/**
 * Get paginated list of bins.
 * GET /api/Bin
 */
export const getBins = (params?: GetBinsRequest) => api.get('/Bin', { params });

/**
 * Get a single bin by bin number.
 * GET /api/Bin/{binNo}
 */
export const getBin = (binNo: string) => api.get(`/Bin/${binNo}`);

/**
 * Update an existing bin.
 * PUT /api/Bin/{binNo}
 */
export const updateBin = (binNo: string, data: UpdateBinRequest) => api.put(`/Bin/${binNo}`, data);

/**
 * Soft-delete a bin by bin number.
 * DELETE /api/Bin/{binNo}
 */
export const deleteBin = (binNo: string) => api.delete(`/Bin/${binNo}`);
