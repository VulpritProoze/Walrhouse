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
import { CalendarIcon, Loader2, Search } from 'lucide-react';
import { BatchStatus } from '@/features/batch/types';
import { createBatchSchema, updateBatchSchema } from '../../types/batch.schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { type BatchDto } from '../../types/batch-dto';
import { DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { BatchFormItemSearchSheet } from './BatchFormItemSearchSheet';
import { BatchFormBinSearchSheet } from './BatchFormBinSearchSheet';

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

  const [isItemSearchOpen, setIsItemSearchOpen] = useState(false);
  const [isBinSearchOpen, setIsBinSearchOpen] = useState(false);

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
          <div className="relative group/field min-w-0 flex-1">
            <Input
              readOnly
              disabled={loading}
              value={form.itemCode}
              placeholder="Select an item..."
              className={
                errors.itemCode ? 'border-destructive pr-10 cursor-pointer' : 'pr-10 cursor-pointer'
              }
              onClick={() => !loading && setIsItemSearchOpen(true)}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                disabled={loading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <BatchFormItemSearchSheet
              open={isItemSearchOpen}
              onOpenChange={setIsItemSearchOpen}
              selectedCode={form.itemCode}
              disabled={loading}
              onSelect={(code) => {
                setForm({ ...form, itemCode: code });
                if (errors.itemCode) setErrors((prev) => ({ ...prev, itemCode: '' }));
              }}
            />
          </div>
          {errors.itemCode && <p className="text-xs text-destructive">{errors.itemCode}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Bin No</label>
          <div className="relative group/field min-w-0 flex-1">
            <Input
              readOnly
              disabled={loading}
              value={form.binNo}
              placeholder="Select a bin..."
              className={
                errors.binNo ? 'border-destructive pr-10 cursor-pointer' : 'pr-10 cursor-pointer'
              }
              onClick={() => !loading && setIsBinSearchOpen(true)}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                disabled={loading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <BatchFormBinSearchSheet
              open={isBinSearchOpen}
              onOpenChange={setIsBinSearchOpen}
              selectedNo={form.binNo}
              disabled={loading}
              onSelect={(binNo) => {
                setForm({ ...form, binNo: binNo });
                if (errors.binNo) setErrors((prev) => ({ ...prev, binNo: '' }));
              }}
            />
          </div>
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
