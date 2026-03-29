/**
 * Core application roles mapping to server-side string values.
 */
export const Roles = {
  Administrator: 'Administrator',
  WarehouseAdministrator: 'Warehouse Administrator',
  InventoryController: 'Inventory Controller',
  InventoryClerk: 'Inventory Clerk',
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];

export const RolePriority: Record<Roles, number> = {
  [Roles.InventoryClerk]: 1,
  [Roles.InventoryController]: 2,
  [Roles.WarehouseAdministrator]: 3,
  [Roles.Administrator]: 4,
};

/**
 * Common color variants for roles across the UI.
 */
export const RoleVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  [Roles.Administrator]: 'destructive',
  [Roles.WarehouseAdministrator]: 'warning',
  [Roles.InventoryController]: 'success',
  [Roles.InventoryClerk]: 'secondary',
};
