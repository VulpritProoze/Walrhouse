import React from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Roles as RoleType } from '@/features/auth/types/roles';
import { Header, Nav, Footer, UserButton } from '@/features/layout';
import { getNavForRole } from '@/features/layout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type Props = {
  role: RoleType;
  children: React.ReactNode;
  navItems?: import('@/features/layout/constants/nav').NavItem[];
};

export default function CommonLayout({ role, children, navItems }: Props) {
  const reduce = useReducedMotion();

  const container = reduce
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
      };

  const items = navItems ?? getNavForRole(role);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <motion.header
        {...container}
        className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Header roleLabel={role} />

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory, SKUs, or locations..."
                className="pl-9 bg-background/50 focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Nav items={items} />
            <UserButton />
          </div>
        </div>
      </motion.header>

      <main className={cn('mx-auto max-w-7xl px-4 py-6 flex-1 min-h-0 w-full')}>
        {children}
      </main>

      <div className="mt-auto overflow-hidden">
        <motion.footer {...container} className="border-t bg-card/80">
          <Footer />
        </motion.footer>
      </div>
    </div>
  );
}
