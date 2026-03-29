import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { Toaster } from './components/ui/sonner';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/features/auth/context/AuthContext.tsx';
import { TooltipProvider } from '@/components/ui/tooltip';

const toastOptions = {
  duration: 5000,
};

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster toastOptions={toastOptions} />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
