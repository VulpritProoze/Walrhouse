import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BatchStatus } from '@/features/batch/types';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { type BatchDto } from '../../types/batch-dto';

interface BatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: BatchDto;
  onFormChange: (form: BatchDto) => void;
  onSubmit: () => void;
}

export const AddBatchDialog = ({
  open,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
}: BatchDialogProps) => {
  const statusLabel =
    {
      [BatchStatus.Released]: 'Released',
      [BatchStatus.Locked]: 'Locked',
      [BatchStatus.Restricted]: 'Restricted',
    }[form.status] || 'Pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Batch</DialogTitle>
          <DialogDescription>
            Add a new batch. Keep fields minimal for fast entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div>
            <Label>Batch Number</Label>
            <Input
              value={form.batchNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFormChange({ ...form, batchNumber: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Item Code</Label>
            <Input
              value={form.itemCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFormChange({ ...form, itemCode: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Bin No</Label>
            <Input
              value={form.binNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFormChange({ ...form, binNo: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                    onFormChange({
                      ...form,
                      expiryDate: date ? date.toISOString().split('T')[0] : '',
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.status.toString()}
              onValueChange={(val) => onFormChange({ ...form, status: Number(val) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{statusLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                <SelectItem value={BatchStatus.Released.toString()}>Released</SelectItem>
                <SelectItem value={BatchStatus.Locked.toString()}>Locked</SelectItem>
                <SelectItem value={BatchStatus.Restricted.toString()}>Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const UpdateBatchDialog = ({
  open,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
}: BatchDialogProps) => {
  const statusLabel =
    {
      [BatchStatus.Released]: 'Released',
      [BatchStatus.Locked]: 'Locked',
      [BatchStatus.Restricted]: 'Restricted',
    }[form.status] || 'Pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Batch</DialogTitle>
          <DialogDescription>Update batch details. Changes are local only.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div>
            <Label>Batch Number</Label>
            <Input
              value={form.batchNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFormChange({ ...form, batchNumber: e.target.value })
              }
              disabled
            />
          </div>
          <div>
            <Label>Item Code</Label>
            <Input
              value={form.itemCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFormChange({ ...form, itemCode: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Bin No</Label>
            <Input
              value={form.binNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFormChange({ ...form, binNo: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                    onFormChange({
                      ...form,
                      expiryDate: date ? date.toISOString().split('T')[0] : '',
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.status.toString()}
              onValueChange={(val) => onFormChange({ ...form, status: Number(val) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{statusLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                <SelectItem value={BatchStatus.Released.toString()}>Released</SelectItem>
                <SelectItem value={BatchStatus.Locked.toString()}>Locked</SelectItem>
                <SelectItem value={BatchStatus.Restricted.toString()}>Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
