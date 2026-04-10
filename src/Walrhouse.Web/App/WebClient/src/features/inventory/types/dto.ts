import { BarcodeFormat, ItemGroup } from '@/features/item/types';

export interface ItemDto {
  itemCode: string;
  itemName: string;
  uoMGroupId: number;
  barcodeValue?: string;
  barcodeFormat?: BarcodeFormat | null;
  itemGroup?: ItemGroup | null;
  remarks?: string | null;
}
