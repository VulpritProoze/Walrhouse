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
import { CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { type IncomingOrderDto, IncomingOrderStatus } from '../../types/incoming-order-dto';

interface IncomingOrderFormProps {
  initial: IncomingOrderDto;
  mode: 'add' | 'edit';
  isLoading?: boolean;
  onSave: (data: IncomingOrderDto) => Promise<void>;
  onSuccess: () => void;
}

export function IncomingOrderForm({
  initial,
  mode,
  isLoading,
  onSave,
  onSuccess,
}: IncomingOrderFormProps) {
  const [form, setForm] = useState<IncomingOrderDto>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loading = isLoading || isSubmitting;
  const isAdd = mode === 'add';

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(isAdd ? 'Creating order...' : 'Updating order...');

    try {
      await onSave(form);
      toast.success(isAdd ? 'Order created successfully' : 'Order updated successfully', {
        id: toastId,
      });
      onSuccess();
    } catch {
      toast.error(isAdd ? 'Failed to create order' : 'Failed to update order', {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAddLine = () => {
    setForm({
      ...form,
      orderLines: [...form.orderLines, { batchNumbers: [] }],
    });
  };

  const handleRemoveLine = (index: number) => {
    setForm({
      ...form,
      orderLines: form.orderLines.filter((_, i) => i !== index),
    });
  };

  const handleBatchChange = (lineIndex: number, value: string) => {
    const newLines = [...form.orderLines];
    newLines[lineIndex].batchNumbers = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setForm({ ...form, orderLines: newLines });
  };

  const statusLabel = {
    [IncomingOrderStatus.Open]: 'Open',
    [IncomingOrderStatus.Closed]: 'Closed',
    [IncomingOrderStatus.Cancelled]: 'Cancelled',
  }[form.status || IncomingOrderStatus.Open];

  return (
    <>
      <DialogTitle>{isAdd ? 'Add Incoming Order' : 'Edit Incoming Order'}</DialogTitle>
      <DialogDescription>
        {isAdd
          ? 'Create a new incoming sales order for verification.'
          : 'Update current order details and line items.'}
      </DialogDescription>

      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Customer Name</label>
          <Input
            disabled={loading}
            value={form.customerName ?? ''}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            placeholder="e.g. ACME Corp"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.dueDate ? format(parseISO(form.dueDate), 'PPP') : <span>Pick a date</span>}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.dueDate ? parseISO(form.dueDate) : undefined}
                onSelect={(date) => setForm({ ...form, dueDate: date ? date.toISOString() : null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {!isAdd && (
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              disabled={loading}
              value={form.status?.toString()}
              onValueChange={(v) => setForm({ ...form, status: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue>{statusLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={IncomingOrderStatus.Open.toString()}>Open</SelectItem>
                <SelectItem value={IncomingOrderStatus.Closed.toString()}>Closed</SelectItem>
                <SelectItem value={IncomingOrderStatus.Cancelled.toString()}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid gap-2">
          <label className="text-sm font-medium">Remarks</label>
          <Input
            disabled={loading}
            value={form.remarks ?? ''}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            placeholder="Additional notes..."
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Order Lines</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLine}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Line
            </Button>
          </div>

          {form.orderLines.map((line, index) => (
            <div key={index} className="grid gap-3 p-3 border rounded-md relative bg-muted/20">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 text-destructive"
                onClick={() => handleRemoveLine(index)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Batches (comma separated)
                </label>
                <Input
                  disabled={loading}
                  value={line.batchNumbers.join(', ')}
                  onChange={(e) => handleBatchChange(index, e.target.value)}
                  placeholder="B001, B002..."
                  className="h-8 text-xs"
                />
              </div>
            </div>
          ))}
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
            'Create Order'
          ) : (
            'Save Changes'
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
