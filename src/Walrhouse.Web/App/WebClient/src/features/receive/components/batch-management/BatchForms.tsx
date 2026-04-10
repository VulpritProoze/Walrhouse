import React, { useState } from 'react';
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
import {
  useCreateBatch,
  useUpdateBatch,
} from '@/features/batch/hooks/mutations/use-batch-mutation';
import { type BatchDto } from '../../types/batch-dto';
import { z } from 'zod';
import { toast } from 'sonner';

interface BatchFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateBatchForm = ({ onSuccess, onCancel }: BatchFormProps) => {
  const { mutateAsync: create } = useCreateBatch();
  const [form, setForm] = useState<BatchDto>({
    batchNumber: '',
    itemCode: '',
    expiryDate: '',
    status: BatchStatus.Released,
    binNo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    try {
      createBatchSchema.parse(form);
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
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Creating batch...');

    try {
      await create(form);
      toast.success('Batch created successfully', { id: toastId });
      onSuccess();
    } catch {
      toast.error('Failed to create batch', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusLabel =
    {
      [BatchStatus.Released]: 'Released',
      [BatchStatus.Locked]: 'Locked',
      [BatchStatus.Restricted]: 'Restricted',
    }[form.status] || 'Pending';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Batch Number</label>
        <Input
          placeholder="BAT-001"
          value={form.batchNumber}
          onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
          className={errors.batchNumber ? 'border-destructive' : ''}
        />
        {errors.batchNumber && <p className="text-xs text-destructive">{errors.batchNumber}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Item Code</label>
        <Input
          placeholder="ITEM-123"
          value={form.itemCode}
          onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
          className={errors.itemCode ? 'border-destructive' : ''}
        />
        {errors.itemCode && <p className="text-xs text-destructive">{errors.itemCode}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bin No</label>
        <Input
          placeholder="BIN-01"
          value={form.binNo}
          onChange={(e) => setForm({ ...form, binNo: e.target.value })}
          className={errors.binNo ? 'border-destructive' : ''}
        />
        {errors.binNo && <p className="text-xs text-destructive">{errors.binNo}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Expiry Date</label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
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
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
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

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create
        </Button>
      </div>
    </form>
  );
};

export const UpdateBatchForm = ({
  batch,
  onSuccess,
  onCancel,
}: { batch: BatchDto } & BatchFormProps) => {
  const { mutateAsync: update } = useUpdateBatch();
  const [form, setForm] = useState<BatchDto>(batch);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    try {
      updateBatchSchema.parse(form);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Updating batch...');

    try {
      await update({ batchNumber: batch.batchNumber, data: form });
      toast.success('Batch updated successfully', { id: toastId });
      onSuccess();
    } catch {
      toast.error('Failed to update batch', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusLabel =
    {
      [BatchStatus.Released]: 'Released',
      [BatchStatus.Locked]: 'Locked',
      [BatchStatus.Restricted]: 'Restricted',
    }[form.status] || 'Pending';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Batch Number</label>
        <Input value={batch.batchNumber} disabled className="bg-muted" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Item Code</label>
        <Input
          value={form.itemCode}
          onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
          className={errors.itemCode ? 'border-destructive' : ''}
        />
        {errors.itemCode && <p className="text-xs text-destructive">{errors.itemCode}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bin No</label>
        <Input
          value={form.binNo}
          onChange={(e) => setForm({ ...form, binNo: e.target.value })}
          className={errors.binNo ? 'border-destructive' : ''}
        />
        {errors.binNo && <p className="text-xs text-destructive">{errors.binNo}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Expiry Date</label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
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
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
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

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};
