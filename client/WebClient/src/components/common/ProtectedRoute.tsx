import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Roles } from '@/features/auth';
import { LoadingScreen } from './LoadingScreen';

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
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen open={true} message="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user && !user.roles.some((r) => (allowedRoles as string[]).includes(r))) {
    // User is authenticated but lacks role — send to a safe landing page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
