import { useState } from 'react';
import { ItemGroup, BarcodeFormat } from '@/features/item/types/enums';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { logger } from '@/lib/utils/logger';
import { type ItemDto } from '../../types/dto';
import { z } from 'zod';
import { itemSchema } from '@/lib/schemas/item.schema';

interface ItemFormProps {
  initial: ItemDto | null;
  mode: 'add' | 'edit';
  isLoading?: boolean;
  onSave: (data: ItemDto) => Promise<void>;
  onSuccess: () => void;
}

export function ItemForm({ initial, mode, isLoading, onSave, onSuccess }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemDto>(
    initial ?? {
      itemCode: '',
      itemName: '',
      uoMGroupId: 1,
      itemGroup: ItemGroup.General,
      barcodeValue: '',
      barcodeFormat: BarcodeFormat.GS1_128,
      remarks: '',
    },
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loading = isLoading || isSubmitting;
  const isAdd = mode === 'add';

  const updateField = <K extends keyof ItemDto>(field: K, value: ItemDto[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  function validate() {
    try {
      // Use the existing zod schema for validation
      const validationData = {
        ...formData,
        uoMGroupId: formData.uoMGroupId.toString(),
        barcodeValue: formData.barcodeValue || undefined,
        remarks: formData.remarks || undefined,
      };

      itemSchema.parse(validationData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formatted: Record<string, string> = {};
        err.issues.forEach((e) => {
          if (e.path[0]) formatted[e.path[0] as string] = e.message;
        });
        setErrors(formatted);
      }
      return false;
    }
  }

  async function handleSave() {
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = toast.loading(isAdd ? 'Creating item...' : 'Updating item...');

    try {
      await onSave(formData);
      toast.success(isAdd ? 'Item created successfully' : 'Item updated successfully', {
        id: toastId,
      });
      onSuccess();
    } catch (err) {
      toast.error(isAdd ? 'Failed to create item' : 'Failed to update item', {
        id: toastId,
      });
      logger.error('Failed to save item', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogTitle>{isAdd ? 'Add Item' : 'Edit Item'}</DialogTitle>
      <DialogDescription>
        {isAdd ? 'Create a new inventory item.' : 'Update the details for this item.'}
      </DialogDescription>

      <div className="grid gap-4 py-4">
        {/* Item Code */}
        <div className="grid gap-2">
          <Label className={errors.itemCode ? 'text-destructive' : ''}>Item Code</Label>
          <Input
            disabled={!isAdd || loading}
            value={formData.itemCode}
            onChange={(e) => updateField('itemCode', e.target.value)}
            placeholder="e.g. ITEM-001"
            className={!isAdd ? 'bg-muted/50' : errors.itemCode ? 'border-destructive' : ''}
          />
          {errors.itemCode && <p className="text-xs text-destructive">{errors.itemCode}</p>}
        </div>

        {/* Item Name */}
        <div className="grid gap-2">
          <Label className={errors.itemName ? 'text-destructive' : ''}>Item Name</Label>
          <Input
            disabled={loading}
            value={formData.itemName}
            onChange={(e) => updateField('itemName', e.target.value)}
            placeholder="Product name"
            className={errors.itemName ? 'border-destructive' : ''}
          />
          {errors.itemName && <p className="text-xs text-destructive">{errors.itemName}</p>}
        </div>

        {/* UoM Group */}
        <div className="grid gap-2">
          <Label className={errors.uoMGroupId ? 'text-destructive' : ''}>UoM Group</Label>
          <Select
            value={formData.uoMGroupId.toString()}
            onValueChange={(v) => {
              if (v) updateField('uoMGroupId', parseInt(v));
            }}
            disabled={loading}
          >
            <SelectTrigger className={errors.uoMGroupId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select UoM Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Pieces (Default)</SelectItem>
              <SelectItem value="2">Weight-based</SelectItem>
              <SelectItem value="3">Boxes/Pallets</SelectItem>
            </SelectContent>
          </Select>
          {errors.uoMGroupId && <p className="text-xs text-destructive">{errors.uoMGroupId}</p>}
        </div>

        {/* Item Group */}
        <div className="grid gap-2">
          <Label>Item Group</Label>
          <Select
            value={formData.itemGroup?.toString() || ''}
            onValueChange={(v) => {
              if (v) updateField('itemGroup', parseInt(v) as ItemGroup);
            }}
            disabled={loading}
          >
            <SelectTrigger>
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

        {/* Barcode Section */}
        <div className="grid gap-2">
          <Label>Barcode</Label>
          <div className="flex gap-2">
            <Input
              value={formData.barcodeValue || ''}
              onChange={(e) => updateField('barcodeValue', e.target.value)}
              placeholder="Value"
              className="flex-1"
              disabled={loading}
            />
            <Select
              value={formData.barcodeFormat?.toString() || ''}
              onValueChange={(v) => {
                if (v) updateField('barcodeFormat', parseInt(v) as BarcodeFormat);
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-32">
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

        {/* Remarks */}
        <div className="grid gap-2">
          <Label>Remarks</Label>
          <Textarea
            value={formData.remarks || ''}
            onChange={(e) => updateField('remarks', e.target.value)}
            placeholder="Internal notes..."
            disabled={loading}
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose
          render={
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          }
        />
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : isAdd ? 'Create' : 'Save'}
        </Button>
      </DialogFooter>
    </>
  );
}
