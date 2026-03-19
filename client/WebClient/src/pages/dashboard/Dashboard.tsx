import { motion, useReducedMotion } from 'framer-motion';
import CommonLayout from '@/layouts/CommonLayout';
import { Roles } from '@/features/auth/types/roles';
import MainContent from './sections/MainContent';
import QuickActions from './sections/QuickActions';

export default function Dashboard() {
  const reduce = useReducedMotion();
  const headerAnim = reduce
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
      };

  return (
    <CommonLayout role={Roles.InventoryClerk}>
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

