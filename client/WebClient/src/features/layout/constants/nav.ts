import { Roles as RoleType, Roles } from '@/features/auth/types/roles';
import { Package, Download, BarChart3, ScanLine, History, type LucideIcon } from 'lucide-react';

export type NavItem = {
  key: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  variant?: 'ghost' | 'outline' | 'default';
};

const adminNav: NavItem[] = [
  { key: 'inventory', label: 'Inventory', href: '#', icon: Package },
  { key: 'receive', label: 'Receive', href: '#', icon: Download },
];

const warehouseNav: NavItem[] = [
  { key: 'receive', label: 'Receive', href: '#', icon: Download },
  { key: 'inventory', label: 'Inventory', href: '#', icon: Package },
];

const controllerNav: NavItem[] = [
  { key: 'inventory', label: 'Inventory', href: '#', icon: Package },
  { key: 'reports', label: 'Reports', href: '#', icon: BarChart3 },
];

const clerkNav: NavItem[] = [
  { key: 'verification', label: 'Verification', href: '/verification', icon: ScanLine },
  { key: 'history', label: 'History', href: '/history', icon: History },
];

const roleNavMap: Record<RoleType, NavItem[]> = {
  [Roles.Administrator]: adminNav,
  [Roles.WarehouseAdministrator]: warehouseNav,
  [Roles.InventoryController]: controllerNav,
  [Roles.InventoryClerk]: clerkNav,
};

export function getNavForRole(role: RoleType) {
  return roleNavMap[role] ?? adminNav;
}

export default roleNavMap;
