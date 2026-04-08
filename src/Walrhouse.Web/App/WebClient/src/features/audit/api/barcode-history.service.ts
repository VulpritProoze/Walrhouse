import { api } from '@/lib/axios';

export interface CreateBarcodeHistoryRequest {
  barcodeValue: string;
  barcodeFormat?: number;
  remarks?: string;
  createdBy?: string;
}

/** Query params for listing barcode histories. */
export interface GetBarcodeHistoriesRequest {
  pageNumber?: number;
  pageSize?: number;
}

// Service
/**
 * Create a new barcode history entry
 * @param request - The data required to create a barcode history entry.
 */
export const createBarcodeHistory = (request: CreateBarcodeHistoryRequest) => {
  return api.post<number>('BarcodeHistory', request);
};

/**
 * Get paginated list of barcode history entries
 * @param params - Optional query parameters for pagination.
 */
export const getBarcodeHistories = (params: GetBarcodeHistoriesRequest) => {
  return api.get('BarcodeHistory', { params });
};

/**
 * Get a single barcode history entry by id
 * @param id - The unique identifier of the barcode history entry.
 */
export const getBarcodeHistory = (id: number) => {
  return api.get(`BarcodeHistory/${id}`);
};
