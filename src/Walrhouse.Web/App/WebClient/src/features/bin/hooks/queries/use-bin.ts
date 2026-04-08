import { useQuery } from '@tanstack/react-query';
import { getBin, getBins, type GetBinsRequest } from '@/features/bin/api/bin.service';

export function useBins(params?: GetBinsRequest) {
  return useQuery({
    queryKey: ['bins', 'list', params ?? {}],
    queryFn: async () => {
      const res = await getBins(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useBin(binNo: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['bins', 'item', binNo],
    queryFn: async () => {
      const res = await getBin(binNo);
      return res.data;
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}

export default { useBins, useBin };
