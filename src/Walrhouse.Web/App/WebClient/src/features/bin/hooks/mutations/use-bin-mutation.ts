import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBin,
  updateBin,
  deleteBin,
  type CreateBinRequest,
  type UpdateBinRequest,
} from '@/features/bin/api/bin.service';

export function useCreateBin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBinRequest) => {
      const res = await createBin(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bins', 'list'] }),
  });
}

export function useUpdateBin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ binNo, data }: { binNo: string; data: UpdateBinRequest }) => {
      const res = await updateBin(binNo, data);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['bins', 'list'] });
      qc.invalidateQueries({ queryKey: ['bins', 'item', vars.binNo] });
    },
  });
}

export function useDeleteBin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (binNo: string) => {
      const res = await deleteBin(binNo);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bins', 'list'] }),
  });
}
