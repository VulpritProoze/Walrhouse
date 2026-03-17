export const Roles = {
  Administrator: 'Administrator',
  WarehouseAdministrator: 'WarehouseAdministrator',
  InventoryController: 'InventoryController',
  InventoryClerk: 'InventoryClerk',
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
