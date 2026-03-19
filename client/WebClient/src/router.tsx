import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard';
import Login from '@/pages/auth/Login';
import VerificationPage from '@/pages/verification/VerificationPage';
import HistoryPage from '@/pages/history/HistoryPage';

export const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/auth/login', element: <Login /> },
  { path: '/verification', element: <VerificationPage /> },
  { path: '/history', element: <HistoryPage /> },
]);

export default router;
