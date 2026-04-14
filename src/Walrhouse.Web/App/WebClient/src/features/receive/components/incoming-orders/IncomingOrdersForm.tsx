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
import { CalendarIcon, Loader2, Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { type IncomingOrderDto, IncomingOrderStatus } from '../../types/incoming-order-dto';
import { createSalesOrderSchema, updateSalesOrderSchema } from '../../types/sales-order-schema';
import { ItemCodeSelectionSheet } from './ItemCodeSelectionSheet';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeItemLineIndex, setActiveItemLineIndex] = useState<number | null>(null);

  const loading = isLoading || isSubmitting;
  const isAdd = mode === 'add';

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function validate() {
    try {
      if (isAdd) {
        createSalesOrderSchema.parse(form);
      } else {
        updateSalesOrderSchema.parse(form);
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formatted: Record<string, string> = {};
        err.issues.forEach((e) => {
          const path = e.path.join('.');
          formatted[path] = e.message;
        });
        setErrors(formatted);
      }
      return false;
    }
  }

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(isAdd ? 'Creating order...' : 'Updating order...');

    try {
      if (isClosed) {
        toast.error('Cannot update a closed order', { id: toastId });
        return;
      }
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
      orderLines: [
        ...form.orderLines,
        {
          itemCode: '',
          unitOfMeasure: '',
          orderedQty: 1,
        },
      ],
    });
  };

  const handleRemoveLine = (index: number) => {
    setForm({
      ...form,
      orderLines: form.orderLines.filter((_, i) => i !== index),
    });
  };

  const handleSelectItemCode = (itemCode: string) => {
    if (activeItemLineIndex !== null) {
      const newLines = [...form.orderLines];
      newLines[activeItemLineIndex].itemCode = itemCode;
      setForm({ ...form, orderLines: newLines });
    }
  };

  const statusLabel = {
    [IncomingOrderStatus.Open]: 'Open',
    [IncomingOrderStatus.Closed]: 'Closed',
    [IncomingOrderStatus.Cancelled]: 'Cancelled',
  }[form.status || IncomingOrderStatus.Open];

  const isClosed = form.status === IncomingOrderStatus.Closed;

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
            disabled={loading || isClosed}
            value={form.customerName ?? ''}
            onChange={(e) => {
              setForm({ ...form, customerName: e.target.value });
              if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
            }}
            placeholder="e.g. ACME Corp"
            className={errors.customerName ? 'border-destructive' : ''}
          />
          {errors.customerName && <p className="text-xs text-destructive">{errors.customerName}</p>}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  disabled={loading || isClosed}
                  className={`w-full justify-start text-left font-normal ${
                    errors.dueDate ? 'border-destructive' : ''
                  }`}
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
                onSelect={(date) => {
                  setForm({ ...form, dueDate: date ? date.toISOString() : null });
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
        </div>

        {!isAdd && (
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Status</label>
              {form.closedBy && (
                <span className="text-xs text-muted-foreground">Closed by: {form.closedBy}</span>
              )}
            </div>
            <Select
              disabled={loading || isClosed}
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
            {isClosed && (
              <p className="text-xs text-destructive">
                This order is closed and cannot be modified or reopened.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-2">
          <label className="text-sm font-medium">Remarks</label>
          <Input
            disabled={loading || isClosed}
            value={form.remarks ?? ''}
            onChange={(e) => {
              setForm({ ...form, remarks: e.target.value });
              if (errors.remarks) setErrors((prev) => ({ ...prev, remarks: '' }));
            }}
            placeholder="Additional notes..."
            className={errors.remarks ? 'border-destructive' : ''}
          />
          {errors.remarks && <p className="text-xs text-destructive">{errors.remarks}</p>}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold">Order Lines</h4>
              {errors.orderLines && (
                <p className="text-xs text-destructive">{errors.orderLines}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLine}
              disabled={loading || isClosed}
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
                disabled={loading || isClosed}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Item Code</label>
                  <div className="flex gap-1">
                    <Input
                      className={`h-8 text-xs flex-1 ${
                        errors[`orderLines.${index}.itemCode`] ? 'border-destructive' : ''
                      }`}
                      placeholder="ITM-001"
                      value={line.itemCode}
                      onChange={(e) => {
                        const newLines = [...form.orderLines];
                        newLines[index].itemCode = e.target.value;
                        setForm({ ...form, orderLines: newLines });
                        if (errors[`orderLines.${index}.itemCode`])
                          setErrors((prev) => ({ ...prev, [`orderLines.${index}.itemCode`]: '' }));
                      }}
                      disabled={loading || isClosed}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={loading || isClosed}
                      onClick={() => setActiveItemLineIndex(index)}
                    >
                      <Search className="h-3 w-3" />
                    </Button>
                  </div>
                  {errors[`orderLines.${index}.itemCode`] && (
                    <p className="text-[10px] text-destructive">
                      {errors[`orderLines.${index}.itemCode`]}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-muted-foreground">UoM</label>
                  <Input
                    className={`h-8 text-xs ${
                      errors[`orderLines.${index}.unitOfMeasure`] ? 'border-destructive' : ''
                    }`}
                    placeholder="BOX"
                    value={line.unitOfMeasure}
                    onChange={(e) => {
                      const newLines = [...form.orderLines];
                      newLines[index].unitOfMeasure = e.target.value;
                      setForm({ ...form, orderLines: newLines });
                      if (errors[`orderLines.${index}.unitOfMeasure`])
                        setErrors((prev) => ({
                          ...prev,
                          [`orderLines.${index}.unitOfMeasure`]: '',
                        }));
                    }}
                    disabled={loading || isClosed}
                  />
                  {errors[`orderLines.${index}.unitOfMeasure`] && (
                    <p className="text-[10px] text-destructive">
                      {errors[`orderLines.${index}.unitOfMeasure`]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Ordered Qty</label>
                  <Input
                    type="number"
                    className={`h-8 text-xs ${
                      errors[`orderLines.${index}.orderedQty`] ? 'border-destructive' : ''
                    }`}
                    value={line.orderedQty}
                    onChange={(e) => {
                      const newLines = [...form.orderLines];
                      newLines[index].orderedQty = parseInt(e.target.value) || 0;
                      setForm({ ...form, orderLines: newLines });
                      if (errors[`orderLines.${index}.orderedQty`])
                        setErrors((prev) => ({ ...prev, [`orderLines.${index}.orderedQty`]: '' }));
                    }}
                    disabled={loading || isClosed}
                  />
                  {errors[`orderLines.${index}.orderedQty`] && (
                    <p className="text-[10px] text-destructive">
                      {errors[`orderLines.${index}.orderedQty`]}
                    </p>
                  )}
                </div>
                {!isAdd && (
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Picked Qty</label>
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      value={line.pickedQty ?? 0}
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ItemCodeSelectionSheet
        open={activeItemLineIndex !== null}
        onOpenChange={(open) => !open && setActiveItemLineIndex(null)}
        onSelect={handleSelectItemCode}
      />

      <DialogFooter>
        <DialogClose
          render={
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          }
        />
        <Button onClick={handleSave} disabled={loading || isClosed}>
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
