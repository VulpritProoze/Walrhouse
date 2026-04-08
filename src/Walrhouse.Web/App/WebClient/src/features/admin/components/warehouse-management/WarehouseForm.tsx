import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CreateWarehouseSchema, UpdateWarehouseSchema } from './schemas/warehouse.schema';
import { z } from 'zod';
import { DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface WarehouseInfo {
  id: string;
  code: string;
  name: string;
}

interface WarehouseFormProps {
  initial: WarehouseInfo;
  mode: 'add' | 'edit';
  isLoading?: boolean;
  onSave: (data: WarehouseInfo) => Promise<void>;
  onSuccess: () => void;
}

export function WarehouseForm({ initial, mode, isLoading, onSave, onSuccess }: WarehouseFormProps) {
  const [code, setCode] = useState(initial.code ?? '');
  const [name, setName] = useState(initial.name ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loading = isLoading || isSubmitting;
  const isAdd = mode === 'add';

  function validate() {
    try {
      if (isAdd) {
        CreateWarehouseSchema.parse({ code, name });
      } else {
        UpdateWarehouseSchema.parse({ name });
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
    const toastId = toast.loading(isAdd ? 'Creating warehouse...' : 'Updating warehouse...');

    try {
      await onSave({ ...initial, code, name });
      toast.success(isAdd ? 'Warehouse created successfully' : 'Warehouse updated successfully', {
        id: toastId,
      });
      onSuccess();
    } catch (err) {
      toast.error(isAdd ? 'Failed to create warehouse' : 'Failed to update warehouse', {
        id: toastId,
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogTitle>{isAdd ? 'Add Warehouse' : 'Edit Warehouse'}</DialogTitle>
      <DialogDescription>
        {isAdd
          ? 'Create a new physical storage facility.'
          : 'Update the details for this warehouse.'}
      </DialogDescription>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Warehouse Code</label>
          <Input
            disabled={!isAdd || loading}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (errors.code) setErrors((prev) => ({ ...prev, code: '' }));
            }}
            placeholder="e.g. W-MAIN"
            className={!isAdd ? 'bg-muted/50' : errors.code ? 'border-destructive' : ''}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Warehouse Name</label>
          <Input
            disabled={loading}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Display name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
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
