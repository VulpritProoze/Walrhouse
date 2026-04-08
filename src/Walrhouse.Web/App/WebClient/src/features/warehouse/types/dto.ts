/**
 * Data Transfer Object for Warehouse entity.
 * Replicates the structure of Walrhouse.Domain.Entities.Warehouse.
 */
export interface WarehouseDto {
  id: string;
  warehouseCode: string;
  warehouseName: string | null;
  // Auditable fields if needed
  created?: string;
  createdBy?: string;
  lastModified?: string;
  lastModifiedBy?: string;
}
