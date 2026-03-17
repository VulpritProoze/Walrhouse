import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Roles } from '@/features/auth/types/roles';

interface ProtectedRouteProps {
  /** Which roles are allowed through. Omit to allow any authenticated user. */
  allowedRoles?: Array<(typeof Roles)[keyof typeof Roles]>;
  /** Where to redirect unauthenticated users. Defaults to /login. */
  redirectTo?: string;
}

/**
 * Warehouse Route guard component.
 *
 * - While auth is loading (silent refresh), shows a centered spinner.
 * - Redirects unauthenticated users to the login page.
 * - If `allowedRoles` is set, redirects users whose role isn't in the list.
 * - Otherwise renders `<Outlet />` (child routes).
 */
export default function ProtectedRoute({
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but lacks role — send to a safe landing page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
