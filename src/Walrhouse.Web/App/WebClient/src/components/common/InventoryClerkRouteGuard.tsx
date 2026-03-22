import ProtectedRoute from '@/components/common/ProtectedRoute';
import { Roles } from '@/features/auth';

/**
 * A route guard that requires the user to be an InventoryClerk.
 *
 * @example
 * <Route element={<InventoryClerkRouteGuard />}>
 *   <Route path="zone-a-only" element={SomeZonePage} />
 * </Route>
 */
export function InventoryClerkRouteGuard() {
  return <ProtectedRoute allowedRoles={[Roles.InventoryClerk]} />;
}
