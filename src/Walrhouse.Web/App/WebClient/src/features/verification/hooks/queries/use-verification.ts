import { useQuery } from '@tanstack/react-query';
import {
  getVerificationHistories,
  getVerificationHistory,
  getVerificationHistoriesByCreator,
  type GetVerificationHistoriesQuery,
  type GetVerificationHistoriesByCreatorQuery,
} from '@/features/verification/api';

export function useVerificationHistories(params?: GetVerificationHistoriesQuery) {
  return useQuery({
    queryKey: ['verification', 'list', params ?? {}],
    queryFn: async () => {
      const res = await getVerificationHistories(params ?? {});
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useVerificationHistory(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['verification', 'item', id],
    queryFn: async () => {
      const res = await getVerificationHistory(id);
      return res.data;
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}

export function useVerificationHistoriesByCreator(params: GetVerificationHistoriesByCreatorQuery) {
  return useQuery({
    queryKey: ['verification', 'list-by-creator', params],
    queryFn: async () => {
      const res = await getVerificationHistoriesByCreator(params);
      return res.data;
    },
    staleTime: 30_000,
    enabled: !!params.createdBy,
  });
}

export default {
  useVerificationHistories,
  useVerificationHistory,
  useVerificationHistoriesByCreator,
};
