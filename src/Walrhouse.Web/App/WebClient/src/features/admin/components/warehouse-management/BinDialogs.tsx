import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BinForm, type BinInfo } from './BinForm';

interface AddBinDialogProps {
  isLoading?: boolean;
  onSave: (data: BinInfo) => Promise<void>;
}

export function AddBinDialog({ isLoading, onSave }: AddBinDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Bin
          </Button>
        }
      />
      <DialogContent showCloseButton={!isLoading}>
        <BinForm
          mode="add"
          initial={{ binNo: '', binName: '', warehouseCode: '' }}
          isLoading={isLoading}
          onSave={onSave}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditBinDialogProps {
  bin: BinInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onSave: (data: BinInfo) => Promise<void>;
}

export function EditBinDialog({ bin, open, onOpenChange, isLoading, onSave }: EditBinDialogProps) {
  if (!bin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isLoading}>
        <BinForm
          mode="edit"
          initial={bin}
          isLoading={isLoading}
          onSave={onSave}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
