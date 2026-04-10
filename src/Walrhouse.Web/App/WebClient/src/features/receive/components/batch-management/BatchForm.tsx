import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { BatchStatus } from '@/features/batch/types';
import { createBatchSchema, updateBatchSchema } from '../../types/batch.schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { type BatchDto } from '../../types/batch-dto';
import { DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface BatchFormProps {
  initial: BatchDto;
  mode: 'add' | 'edit';
  isLoading?: boolean;
  onSave: (data: BatchDto) => Promise<void>;
  onSuccess: () => void;
}

export function BatchForm({ initial, mode, isLoading, onSave, onSuccess }: BatchFormProps) {
  const [form, setForm] = useState<BatchDto>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loading = isLoading || isSubmitting;
  const isAdd = mode === 'add';

  // Sync state if initial changes (important for edit mode when 'active' batch changes)
  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function validate() {
    try {
      if (isAdd) {
        createBatchSchema.parse(form);
      } else {
        updateBatchSchema.parse(form);
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
    const toastId = toast.loading(isAdd ? 'Creating batch...' : 'Updating batch...');

    try {
      await onSave(form);
      toast.success(isAdd ? 'Batch created successfully' : 'Batch updated successfully', {
        id: toastId,
      });
      onSuccess();
    } catch {
      toast.error(isAdd ? 'Failed to create batch' : 'Failed to update batch', {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusLabel =
    {
      [BatchStatus.Released]: 'Released',
      [BatchStatus.Locked]: 'Locked',
      [BatchStatus.Restricted]: 'Restricted',
    }[form.status] || 'Pending';

  return (
    <>
      <DialogTitle>{isAdd ? 'Add Batch' : 'Edit Batch'}</DialogTitle>
      <DialogDescription>
        {isAdd
          ? 'Add a new batch. Keep fields minimal for fast entry.'
          : 'Update batch details. Changes are synced to the server.'}
      </DialogDescription>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Batch Number</label>
          <Input
            disabled={!isAdd || loading}
            value={form.batchNumber}
            onChange={(e) => {
              setForm({ ...form, batchNumber: e.target.value });
              if (errors.batchNumber) setErrors((prev) => ({ ...prev, batchNumber: '' }));
            }}
            placeholder="e.g. BAT-001"
            className={!isAdd ? 'bg-muted/50' : errors.batchNumber ? 'border-destructive' : ''}
          />
          {errors.batchNumber && <p className="text-xs text-destructive">{errors.batchNumber}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Item Code</label>
          <Input
            disabled={loading}
            value={form.itemCode}
            onChange={(e) => {
              setForm({ ...form, itemCode: e.target.value });
              if (errors.itemCode) setErrors((prev) => ({ ...prev, itemCode: '' }));
            }}
            placeholder="ITEM-123"
            className={errors.itemCode ? 'border-destructive' : ''}
          />
          {errors.itemCode && <p className="text-xs text-destructive">{errors.itemCode}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Bin No</label>
          <Input
            disabled={loading}
            value={form.binNo}
            onChange={(e) => {
              setForm({ ...form, binNo: e.target.value });
              if (errors.binNo) setErrors((prev) => ({ ...prev, binNo: '' }));
            }}
            placeholder="BIN-01"
            className={errors.binNo ? 'border-destructive' : ''}
          />
          {errors.binNo && <p className="text-xs text-destructive">{errors.binNo}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Expiry Date</label>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  disabled={loading}
                  className={`w-full justify-start text-left font-normal ${
                    errors.expiryDate ? 'border-destructive' : ''
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.expiryDate ? (
                    format(parseISO(form.expiryDate), 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.expiryDate ? parseISO(form.expiryDate) : undefined}
                onSelect={(date) =>
                  setForm({ ...form, expiryDate: date ? date.toISOString().split('T')[0] : '' })
                }
                disabled={
                  isAdd ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0)) : undefined
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            disabled={loading}
            value={form.status.toString()}
            onValueChange={(v) => setForm({ ...form, status: Number(v) })}
          >
            <SelectTrigger>
              <SelectValue>{statusLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BatchStatus.Released.toString()}>Released</SelectItem>
              <SelectItem value={BatchStatus.Locked.toString()}>Locked</SelectItem>
              <SelectItem value={BatchStatus.Restricted.toString()}>Restricted</SelectItem>
            </SelectContent>
          </Select>
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
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isAdd ? (
            'Create'
          ) : (
            'Save'
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
