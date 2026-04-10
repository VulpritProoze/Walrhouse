import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBatch,
  updateBatch,
  deleteBatch,
  type CreateBatchRequest,
  type UpdateBatchRequest,
} from '../../api/batch.service';

export function useCreateBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBatchRequest) => {
      const res = await createBatch(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['batches', 'list'] }),
  });
}

export function useUpdateBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      batchNumber,
      data,
    }: {
      batchNumber: string;
      data: UpdateBatchRequest;
    }) => {
      const res = await updateBatch(batchNumber, data);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['batches', 'list'] });
      qc.invalidateQueries({ queryKey: ['batches', 'item', vars.batchNumber] });
    },
  });
}

export function useDeleteBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (batchNumber: string) => {
      const res = await deleteBatch(batchNumber);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['batches', 'list'] }),
  });
}

export default { useCreateBatch, useUpdateBatch, useDeleteBatch };
