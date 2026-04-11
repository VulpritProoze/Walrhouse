import { api } from '@/lib/axios';

export interface VerificationHistoryDto {
  id: number;
  batchNumberVerified: string;
  remarks?: string;
  createdAt: string;
  createdBy?: string;
}

export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateVerificationCommand {
  batchNumber: string;
  createdBy: string;
  remarks?: string;
}

export interface GetVerificationHistoriesQuery {
  pageNumber?: number;
  pageSize?: number;
}

export interface GetVerificationHistoriesByCreatorQuery extends GetVerificationHistoriesQuery {
  createdBy: string;
}

/**
 * Create a new verification history entry.
 *
 * @param command - The verification data.
 * @returns The created entity ID.
 */
export const createVerification = async (command: CreateVerificationCommand) =>
  await api.post<number>('/Verification', command);

/**
 * Get paginated list of verification histories.
 *
 * @param query - Pagination parameters.
 * @returns Paginated list of verification histories.
 */
export const getVerificationHistories = async (query: GetVerificationHistoriesQuery) =>
  await api.get<PaginatedList<VerificationHistoryDto>>('/Verification', { params: query });

/**
 * Get a verification history by ID.
 *
 * @param id - The verification history ID.
 * @returns The verification history DTO.
 */
export const getVerificationHistory = async (id: number) =>
  await api.get<VerificationHistoryDto>(`/Verification/${id}`);

/**
 * Get paginated list of verification histories for a specific creator.
 *
 * @param query - Pagination parameters and creator ID.
 * @returns Paginated list of verification histories.
 */
export const getVerificationHistoriesByCreator = async (
  query: GetVerificationHistoriesByCreatorQuery,
) => {
  const { createdBy, ...params } = query;
  return await api.get<PaginatedList<VerificationHistoryDto>>(
    `/Verification/by-creator/${createdBy}`,
    { params },
  );
};
