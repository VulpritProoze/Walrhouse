import { useState } from 'react';
import { ItemGroup } from '@/features/item/types/enums';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { logger } from '@/lib/utils/logger';
import { type ItemDto } from '../../types/item-dto';
import { z } from 'zod';
import { itemSchema } from '@/lib/schemas/item.schema';
import { ItemFormUoMGroupSearchSheet } from './ItemFormUoMGroupSearchSheet';

interface AddItemFormProps {
  isLoading?: boolean;
  onSave: (data: ItemDto) => Promise<void>;
  onSuccess: () => void;
  renderFooter?: (loading: boolean, handleSave: () => void) => React.ReactNode;
}

export function AddItemForm({ isLoading, onSave, onSuccess, renderFooter }: AddItemFormProps) {
  const [formData, setFormData] = useState<ItemDto>({
    itemCode: '',
    itemName: '',
    uoMGroupId: null,
    itemGroup: ItemGroup.General,
    remarks: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uoMSheetOpen, setUoMSheetOpen] = useState(false);

  const loading = isLoading || isSubmitting;

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

  const getGroupKey = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '';
    return Object.keys(ItemGroup).find((key) => ItemGroup[key as keyof typeof ItemGroup] === val);
  };

  function validate() {
    try {
      const validationData = {
        ...formData,
        uoMGroupId: formData.uoMGroupId?.toString(),
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
    const toastId = toast.loading('Creating item...');
    try {
      await onSave(formData);
      toast.success('Item created successfully', { id: toastId });
      onSuccess();
    } catch (err) {
      toast.error('Failed to create item', { id: toastId });
      logger.error('Failed to save item', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className={errors.itemCode ? 'text-destructive' : ''}>Item Code</Label>
            <Input
              disabled={loading}
              value={formData.itemCode}
              onChange={(e) => updateField('itemCode', e.target.value)}
              placeholder="e.g. ITEM-001"
              className={errors.itemCode ? 'border-destructive' : ''}
            />
            {errors.itemCode && <p className="text-xs text-destructive">{errors.itemCode}</p>}
          </div>

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

          <div className="grid gap-2">
            <Label className={errors.uoMGroupId ? 'text-destructive' : ''}>UoM Group</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  readOnly
                  placeholder="Select a UoM Group"
                  value={formData.uoMGroupId ? `ID: ${formData.uoMGroupId}` : ''}
                  className={errors.uoMGroupId ? 'border-destructive pr-10' : 'pr-10'}
                  onClick={() => setUoMSheetOpen(true)}
                  disabled={loading}
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                  <ItemFormUoMGroupSearchSheet
                    open={uoMSheetOpen}
                    onOpenChange={setUoMSheetOpen}
                    selectedId={formData.uoMGroupId}
                    onSelect={(uomGroup) => {
                      updateField('uoMGroupId', uomGroup.id);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            {errors.uoMGroupId && <p className="text-xs text-destructive">{errors.uoMGroupId}</p>}
          </div>

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
                <SelectValue placeholder="Select Group">
                  {getGroupKey(formData.itemGroup)}
                </SelectValue>
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
      </div>
      {renderFooter?.(loading, handleSave)}
    </>
  );
}
interface EditItemFormProps {
  initial: ItemDto;
  isLoading?: boolean;
  onSave: (data: ItemDto) => Promise<void>;
  onSuccess: () => void;
  renderFooter?: (loading: boolean, handleSave: () => void) => React.ReactNode;
}

export function EditItemForm({
  initial,
  isLoading,
  onSave,
  onSuccess,
  renderFooter,
}: EditItemFormProps) {
  const [formData, setFormData] = useState<ItemDto>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uoMSheetOpen, setUoMSheetOpen] = useState(false);

  const loading = isLoading || isSubmitting;

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

  const getGroupKey = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '';
    return Object.keys(ItemGroup).find((key) => ItemGroup[key as keyof typeof ItemGroup] === val);
  };

  function validate() {
    try {
      const validationData = {
        ...formData,
        uoMGroupId: formData.uoMGroupId?.toString(),
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
    const toastId = toast.loading('Updating item...');
    try {
      await onSave(formData);
      toast.success('Item updated successfully', { id: toastId });
      onSuccess();
    } catch (err) {
      toast.error('Failed to update item', { id: toastId });
      logger.error('Failed to save item', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className={errors.itemCode ? 'text-destructive' : ''}>Item Code</Label>
            <Input disabled value={formData.itemCode} className="bg-muted/50" />
          </div>

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

          <div className="grid gap-2">
            <Label className={errors.uoMGroupId ? 'text-destructive' : ''}>UoM Group</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  readOnly
                  placeholder="Select a UoM Group"
                  value={formData.uoMGroupId ? `ID: ${formData.uoMGroupId}` : ''}
                  className={errors.uoMGroupId ? 'border-destructive pr-10' : 'pr-10'}
                  onClick={() => setUoMSheetOpen(true)}
                  disabled={loading}
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                  <ItemFormUoMGroupSearchSheet
                    open={uoMSheetOpen}
                    onOpenChange={setUoMSheetOpen}
                    selectedId={formData.uoMGroupId}
                    onSelect={(uomGroup) => {
                      updateField('uoMGroupId', uomGroup.id);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            {errors.uoMGroupId && <p className="text-xs text-destructive">{errors.uoMGroupId}</p>}
          </div>

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
                <SelectValue placeholder="Select Group">
                  {getGroupKey(formData.itemGroup)}
                </SelectValue>
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
      </div>
      {renderFooter?.(loading, handleSave)}
    </>
  );
}
