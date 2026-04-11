import { ItemGroup } from '@/features/item/types';

export interface ItemDto {
  itemCode: string;
  itemName: string;
  uoMGroupId: number | null;
  itemGroup?: ItemGroup | null;
  remarks?: string | null;
}
