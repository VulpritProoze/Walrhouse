import type { Roles as RoleType } from '@/features/auth/types/roles';
import { useAuth } from '@/features/auth/hooks/use-auth';
import CommonLayout from '@/layouts/CommonLayout';
import { AdminPanel } from '@/features/admin';

export default function AdminPage() {
  const { user } = useAuth();
  const roles = (user?.roles as RoleType[]) ?? [];

  return (
    <CommonLayout roles={roles}>
      <AdminPanel />
    </CommonLayout>
  );
}
