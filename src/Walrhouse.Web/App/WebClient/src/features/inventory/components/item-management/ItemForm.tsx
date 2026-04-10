import * as React from 'react';
import { ItemGroup, BarcodeFormat } from '@/features/item/types/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// ─── Types ──────────────────────────────────────────────────────────────────
export interface ItemFormData {
  itemCode: string;
  itemName: string;
  uoMGroupId: string;
  barcodeValue?: string;
  barcodeFormat?: number;
  itemGroup?: number;
  remarks?: string;
}

interface ItemFormProps {
  initialData?: ItemFormData | null;
  mode: 'add' | 'edit';
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const ItemForm = ({ initialData, mode, onSubmit, onCancel }: ItemFormProps) => {
  const [formData, setFormData] = React.useState<ItemFormData>(
    initialData || {
      itemCode: '',
      itemName: '',
      uoMGroupId: '',
      barcodeValue: '',
      barcodeFormat: BarcodeFormat.GS1DataMatrix,
      itemGroup: ItemGroup.General,
      remarks: '',
    },
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        itemCode: '',
        itemName: '',
        uoMGroupId: '',
        barcodeValue: '',
        barcodeFormat: BarcodeFormat.GS1DataMatrix,
        itemGroup: ItemGroup.General,
        remarks: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="itemCode" className="text-right">
            Code
          </Label>
          <Input
            id="itemCode"
            value={formData.itemCode}
            onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
            className="col-span-3"
            disabled={mode === 'edit'}
            placeholder="e.g. ITEM-001"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="itemName" className="text-right">
            Name
          </Label>
          <Input
            id="itemName"
            value={formData.itemName}
            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            className="col-span-3"
            placeholder="Product name"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="uoMGroupId" className="text-right">
            UoM Group
          </Label>
          <Select
            value={formData.uoMGroupId || ''}
            onValueChange={(v) => v && setFormData({ ...formData, uoMGroupId: v })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select UoM Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Pieces (Default)</SelectItem>
              <SelectItem value="2">Weight-based</SelectItem>
              <SelectItem value="3">Boxes/Pallets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="itemGroup" className="text-right">
            Item Group
          </Label>
          <Select
            value={formData.itemGroup?.toString() || ''}
            onValueChange={(v) => v && setFormData({ ...formData, itemGroup: parseInt(v) })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select Group" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ItemGroup).map(([key, value]) => (
                <SelectItem key={value} value={value.toString()}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="barcode" className="text-right">
            Barcode
          </Label>
          <div className="col-span-3 flex gap-2">
            <Input
              id="barcode"
              value={formData.barcodeValue || ''}
              onChange={(e) => setFormData({ ...formData, barcodeValue: e.target.value })}
              className="flex-1"
              placeholder="Value"
            />
            <Select
              value={formData.barcodeFormat?.toString() || ''}
              onValueChange={(v) => v && setFormData({ ...formData, barcodeFormat: parseInt(v) })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BarcodeFormat).map(([key, value]) => (
                  <SelectItem key={value} value={value.toString()}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="remarks" className="text-right">
            Remarks
          </Label>
          <Textarea
            id="remarks"
            value={formData.remarks || ''}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="col-span-3"
            placeholder="Internal notes..."
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{mode === 'add' ? 'Create Item' : 'Save Changes'}</Button>
      </div>
    </form>
  );
};
