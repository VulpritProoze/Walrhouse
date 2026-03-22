import ProtectedRoute from '@/components/common/ProtectedRoute';
import { Roles } from '@/features/auth';

/**
 * A route guard that requires the user to be an InventoryController.
 */
export function InventoryControllerRouteGuard() {
  return <ProtectedRoute allowedRoles={[Roles.InventoryController]} />;
}
