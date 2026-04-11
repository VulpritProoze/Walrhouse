import { useQuery } from '@tanstack/react-query';
import { getBatch, getBatches, type GetBatchesParams } from '../../api/batch.service';

export function useBatches(params?: GetBatchesParams) {
  return useQuery({
    queryKey: ['batches', 'list', params ?? {}],
    queryFn: async () => {
      const res = await getBatches(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useBatch(batchNumber: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['batches', 'item', batchNumber],
    queryFn: async () => {
      const res = await getBatch(batchNumber);
      return res.data;
    },
    enabled: enabled && !!batchNumber,
    staleTime: 30_000,
  });
}

export default { useBatches, useBatch };
