import { Roles as RoleType, Roles } from '@/features/auth/types/roles';
import { Package, Download, BarChart3, ScanLine, History, type LucideIcon } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

export type NavItem = {
  key: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  variant?: 'ghost' | 'outline' | 'default';
};

const adminNav: NavItem[] = [
  { key: 'admin-dashboard', label: 'Admin Panel', href: '#', icon: Package },
];

const warehouseNav: NavItem[] = [
  { key: 'receive', label: 'Receive', href: '#', icon: Download },
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

/**
 * Validates that no two roles share the same navigation item key.
 * 
 * @throws {Error} If an overlap is found.
 */
export function validateNavKeys() {
  const seenKeys = new Map<string, RoleType>();
  
  Object.entries(roleNavMap).forEach(([role, items]) => {
    items.forEach(item => {
      if (seenKeys.has(item.key)) {
        const errorMsg = `Navigation overlap detected: Key [${item.key}] is defined in both [${seenKeys.get(item.key)}] and [${role}]. Keys must be unique per role definition.`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      seenKeys.set(item.key, role as RoleType);
    });
  });
}

// Perform validation in dev mode
if (import.meta.env.DEV) {
  try {
    validateNavKeys();
  } catch {
    // Already logged via logger.error in validateNavKeys
  }
}

/**
 * Merges and returns the unique set of navigation items for multiple roles.
 * 
 * @remarks
 * Administrator exception: If the user has the Administrator role, 
 * they will see all navigation items from all other roles combined.
 */
export function getNavForRoles(roles: RoleType[] = []) {
  // If user is an Admin, gather EVERY defined navigation item
  if (roles.includes(Roles.Administrator)) {
    const allDefinedItems = Object.values(roleNavMap).flat();
    return Array.from(new Map(allDefinedItems.map(item => [item.key, item])).values());
  }

  // Otherwise, only gather items for their specific roles
  const allRoleItems = roles.flatMap(role => roleNavMap[role] ?? []);
  
  // Deduplicate by key for safety
  return Array.from(new Map(allRoleItems.map(item => [item.key, item])).values());
}

export default roleNavMap;
