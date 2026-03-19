export const Roles = {
  Administrator: 'Administrator',
  WarehouseAdministrator: 'Warehouse Administrator',
  InventoryController: 'Inventory Controller',
  InventoryClerk: 'Inventory Clerk',
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
