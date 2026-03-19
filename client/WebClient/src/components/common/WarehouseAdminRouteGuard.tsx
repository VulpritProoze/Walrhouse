import ProtectedRoute from '@/components/common/ProtectedRoute';
import { Roles } from '@/features/auth';

/**
 * A route guard that requires the user to be a WarehouseAdministrator.
 */
export function WarehouseAdminRouteGuard() {
  return <ProtectedRoute allowedRoles={[Roles.WarehouseAdministrator]} />;
}
