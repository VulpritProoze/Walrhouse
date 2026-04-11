import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard';
import Login from '@/pages/auth/Login';
import VerificationPage from '@/pages/verification/VerificationPage';
import ScannerSection from '@/pages/verification/sections/ScannerSection';
import DetailsSection from '@/pages/verification/sections/DetailsSection';
import SettingsSection from '@/pages/verification/sections/SettingsSection';
import InventoryPanel from '@/pages/inventory/InventoryPanel';
import HistoryPage from '@/pages/history/HistoryPage';
import ReceiveDashboard from '@/pages/receive/ReceiveDashboard';
import AdminPage from '@/pages/admin/AdminPage';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { Roles } from '@/features/auth/types/roles';

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Dashboard /> },
      {
        element: <ProtectedRoute allowedRoles={[Roles.InventoryClerk, Roles.Administrator]} />,
        children: [
          {
            path: '/verification',
            element: <VerificationPage />,
            children: [
              { index: true, element: <ScannerSection /> },
              { path: 'details', element: <DetailsSection /> },
              { path: 'settings', element: <SettingsSection /> },
            ],
          },
        ],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={[Roles.WarehouseAdministrator, Roles.Administrator]} />
        ),
        children: [{ path: '/admin', element: <AdminPage /> }],
      },
      {
        element: (
          <ProtectedRoute
            allowedRoles={[
              Roles.Administrator,
              Roles.WarehouseAdministrator,
              Roles.InventoryController,
            ]}
          />
        ),
        children: [{ path: '/inventory', element: <InventoryPanel /> }],
      },
      {
        element: (
          <ProtectedRoute
            allowedRoles={[
              Roles.Administrator,
              Roles.WarehouseAdministrator,
              Roles.InventoryController,
            ]}
          />
        ),
        children: [{ path: '/receive', element: <ReceiveDashboard /> }],
      },
      { path: '/history', element: <HistoryPage /> },
    ],
  },
  { path: '/auth/login', element: <Login /> },
]);

export default router;
