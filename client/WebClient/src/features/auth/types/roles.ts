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

/**
 * Role hierarchy mapping to determine authority levels.
 * Higher numbers indicate higher authority.
 */
export const RolePriority: Record<Roles, number> = {
  [Roles.InventoryClerk]: 1,
  [Roles.InventoryController]: 2,
  [Roles.WarehouseAdministrator]: 3,
  [Roles.Administrator]: 4,
};
