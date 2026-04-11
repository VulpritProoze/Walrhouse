import { api } from '@/lib/axios';

export interface CreateBarcodeHistoryRequest {
  barcodeValue: string;
  barcodeFormat?: number;
  remarks?: string;
  createdBy?: string;
}

export interface GetBarcodeHistoriesRequest {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Get the URL for a generated barcode image.
 * This does not perform an axios call, but returns the constructed URL string
 * for use in <img> tags.
 *
 * @param batchNumber - The batch number to generate a barcode for.
 * @returns The absolute or relative URL to the barcode generation endpoint.
 */
export const getBarcodeImageUrl = (batchNumber: string): string => {
  // We use a relative URL since the browser will prepend the current origin.
  // Note: If you use a custom axios base URL, you might need to reflect that here.
  return `/api/BarcodeHistory/generate/${encodeURIComponent(batchNumber)}`;
};

/**
 * Create a new barcode history entry.
 * POST /api/BarcodeHistory
 */
export const createBarcodeHistory = (data: CreateBarcodeHistoryRequest) => {
  return api.post<number>('/BarcodeHistory', data);
};

/**
 * Get paginated list of barcode history entries.
 * GET /api/BarcodeHistory
 */
export const getBarcodeHistories = (params: GetBarcodeHistoriesRequest) => {
  return api.get('/BarcodeHistory', { params });
};

/**
 * Get a single barcode history entry by id.
 * GET /api/BarcodeHistory/{id}
 */
export const getBarcodeHistory = (id: number) => {
  return api.get(`/api/BarcodeHistory/${id}`);
};
