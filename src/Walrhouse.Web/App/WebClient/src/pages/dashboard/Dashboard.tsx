import { motion, useReducedMotion } from 'framer-motion';
import CommonLayout from '@/layouts/CommonLayout';
// import { Roles } from '@/features/auth/types/roles';
// import { useAuth } from '@/features/auth/hooks/use-auth';
import MainContent from './sections/MainContent';
import QuickActions from './sections/QuickActions';

export default function Dashboard() {
  // const { user } = useAuth();
  const reduce = useReducedMotion();

  // Primary roles currently assigned to the user session
  // const roles = user?.roles ?? [];

  /* 
    Determine the role with the highest authority level (Reserved for specific UI logic)
    Reserved for future use as requested:
    
    const activeRole = roles.reduce<Roles>((highest, current) => {
      const roleCandidate = current as Roles;
      const isValidRole = Object.values(Roles).includes(roleCandidate);
      if (!isValidRole) return highest;
      const currentPriority = RolePriority[roleCandidate] ?? 0;
      const highestPriority = RolePriority[highest] ?? 0;
      return currentPriority > highestPriority ? roleCandidate : highest;
    }, Roles.InventoryClerk as Roles);
  */

  const headerAnim = reduce
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
      };

  return (
    <CommonLayout>
      <div className="min-h-[60vh] flex flex-col gap-6">
        <motion.div {...headerAnim} className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Overview of warehouse activity</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MainContent />
          <QuickActions />
        </div>

        <footer className="mt-auto text-sm text-muted-foreground">Last updated: just now</footer>
      </div>
    </CommonLayout>
  );
}
