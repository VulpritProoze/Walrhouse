import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CreateBinSchema, UpdateBinSchema } from './schemas/bin.schema';
import { z } from 'zod';
import { DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { logger } from '@/lib/utils/logger';
import { BinFormWarehouseSearchSheet } from './BinFormWarehouseSearchSheet';

export interface BinInfo {
  binNo: string;
  binName: string;
  warehouseCode: string;
}

interface BinFormProps {
  initial: BinInfo;
  mode: 'add' | 'edit';
  isLoading?: boolean;
  onSave: (data: BinInfo) => Promise<void>;
  onSuccess: () => void;
}

export function BinForm({ initial, mode, isLoading, onSave, onSuccess }: BinFormProps) {
  const [binNo, setBinNo] = useState(initial.binNo ?? '');
  const [binName, setBinName] = useState(initial.binName ?? '');
  const [warehouseCode, setWarehouseCode] = useState(initial.warehouseCode ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Warehouse selection state
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const loading = isLoading || isSubmitting;
  const isAdd = mode === 'add';

  function validate() {
    try {
      if (isAdd) {
        CreateBinSchema.parse({ binNo, binName, warehouseCode });
      } else {
        UpdateBinSchema.parse({ binName, warehouseCode });
      }
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

  async function handleSave(e: React.MouseEvent) {
    if (!validate()) {
      e.preventDefault();
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(isAdd ? 'Creating bin...' : 'Updating bin...');

    try {
      await onSave({ binNo, binName, warehouseCode });
      toast.success(isAdd ? 'Bin created successfully' : 'Bin updated successfully', {
        id: toastId,
      });
      onSuccess();
    } catch (err) {
      toast.error(isAdd ? 'Failed to create bin' : 'Failed to update bin', {
        id: toastId,
      });
      logger.error('Failed to save bin', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogTitle>{isAdd ? 'Add Bin' : 'Edit Bin'}</DialogTitle>
      <DialogDescription>
        {isAdd ? 'Create a new storage bin location.' : 'Update the details for this bin.'}
      </DialogDescription>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Bin Number</label>
          <Input
            disabled={!isAdd || loading}
            value={binNo}
            onChange={(e) => {
              setBinNo(e.target.value);
              if (errors.binNo) setErrors((prev) => ({ ...prev, binNo: '' }));
            }}
            placeholder="e.g. A-01-01"
            className={!isAdd ? 'bg-muted/50' : errors.binNo ? 'border-destructive' : ''}
          />
          {errors.binNo && <p className="text-xs text-destructive">{errors.binNo}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Bin Name</label>
          <Input
            disabled={loading}
            value={binName}
            onChange={(e) => {
              setBinName(e.target.value);
              if (errors.binName) setErrors((prev) => ({ ...prev, binName: '' }));
            }}
            placeholder="Display name"
            className={errors.binName ? 'border-destructive' : ''}
          />
          {errors.binName && <p className="text-xs text-destructive">{errors.binName}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Warehouse</label>
          <div className="flex gap-2">
            <Input
              readOnly
              placeholder="Select a warehouse"
              value={warehouseCode}
              className={errors.warehouseCode ? 'border-destructive flex-1' : 'flex-1'}
              onClick={() => setIsSheetOpen(true)}
            />
            <BinFormWarehouseSearchSheet
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              selectedCode={warehouseCode}
              onSelect={(code) => {
                setWarehouseCode(code);
                if (errors.warehouseCode) setErrors((prev) => ({ ...prev, warehouseCode: '' }));
              }}
              disabled={loading}
            />
          </div>
          {errors.warehouseCode && (
            <p className="text-xs text-destructive">{errors.warehouseCode}</p>
          )}
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
