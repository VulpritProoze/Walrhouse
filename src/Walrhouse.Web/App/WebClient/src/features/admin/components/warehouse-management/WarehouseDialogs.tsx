import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WarehouseForm, type WarehouseInfo } from './WarehouseForm';

interface AddWarehouseDialogProps {
  isLoading?: boolean;
  onSave: (data: WarehouseInfo) => Promise<void>;
}

export function AddWarehouseDialog({ isLoading, onSave }: AddWarehouseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Warehouse
          </Button>
        }
      />
      <DialogContent showCloseButton={!isLoading}>
        <WarehouseForm
          mode="add"
          initial={{ id: '', code: '', name: '' }}
          isLoading={isLoading}
          onSave={onSave}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditWarehouseDialogProps {
  warehouse: WarehouseInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onSave: (data: WarehouseInfo) => Promise<void>;
}

export function EditWarehouseDialog({
  warehouse,
  open,
  onOpenChange,
  isLoading,
  onSave,
}: EditWarehouseDialogProps) {
  if (!warehouse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isLoading}>
        <WarehouseForm
          mode="edit"
          initial={warehouse}
          isLoading={isLoading}
          onSave={onSave}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
