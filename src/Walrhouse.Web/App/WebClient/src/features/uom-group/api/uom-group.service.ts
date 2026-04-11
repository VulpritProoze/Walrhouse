import { api } from '@/lib/axios';

/**
 * Request payload for creating a new UoM group.
 */
export interface CreateUoMGroupRequest {
  baseUoMName: string;
  uoMGroupLines: UoMGroupLineRequest[];
}

/**
 * Request parameters for getting paginated list of UoM groups.
 */
export interface GetUoMGroupsRequest {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Request payload for updating an existing UoM group.
 */
export interface UpdateUoMGroupRequest {
  baseUoMName?: string | null;
  uoMGroupLines?: UoMGroupLineRequest[] | null;
}

export interface UoMGroupLineRequest {
  uoMName: string;
  baseQty: number;
}

/**
 * Create a new UoM group; returns the group id.
 * POST /api/UoMGroups
 */
export const createUoMGroup = async (data: CreateUoMGroupRequest) => {
  return await api.post<number>('/UoMGroup', data);
};

/**
 * Get paginated list of UoM groups.
 * GET /api/UoMGroups
 */
export const getUoMGroups = async (params?: GetUoMGroupsRequest) => {
  return await api.get('/UoMGroup', { params });
};

/**
 * Get a single UoM group by id.
 * GET /api/UoMGroups/{id}
 */
export const getUoMGroup = async (id: number) => {
  return await api.get(`/UoMGroup/${id}`);
};

/**
 * Update an existing UoM group.
 * PUT /api/UoMGroups/{id}
 */
export const updateUoMGroup = async (id: number, data: UpdateUoMGroupRequest) => {
  return await api.put(`/UoMGroup/${id}`, data);
};

/**
 * Soft-delete a UoM group by id.
 * DELETE /api/UoMGroups/{id}
 */
export const deleteUoMGroup = async (id: number) => {
  return await api.delete(`/UoMGroup/${id}`);
};
