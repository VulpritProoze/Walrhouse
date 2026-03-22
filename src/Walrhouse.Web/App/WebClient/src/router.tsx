import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard';
import Login from '@/pages/auth/Login';
import VerificationPage from '@/pages/verification/VerificationPage';
import HistoryPage from '@/pages/history/HistoryPage';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/verification', element: <VerificationPage /> },
      { path: '/history', element: <HistoryPage /> },
    ],
  },
  { path: '/auth/login', element: <Login /> },
]);

export default router;
