import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVerification, type CreateVerificationCommand } from '@/features/verification/api';

export function useCreateVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (command: CreateVerificationCommand) => {
      const res = await createVerification(command);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the verification list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['verification', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['verification', 'list-by-creator'] });
    },
  });
}

export default { useCreateVerification };
