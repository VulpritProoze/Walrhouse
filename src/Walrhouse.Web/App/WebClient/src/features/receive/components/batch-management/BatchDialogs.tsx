import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BatchForm } from './BatchForm';
import { type BatchDto } from '../../types/batch-dto';
import { BatchStatus } from '@/features/batch/types';

interface BatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onSave: (data: BatchDto) => Promise<void>;
}

export function AddBatchDialog({ open, onOpenChange, isLoading, onSave }: BatchDialogProps) {
  const initial: BatchDto = {
    batchNumber: '',
    itemCode: '',
    binNo: '',
    status: BatchStatus.Released,
    expiryDate: '',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <BatchForm
          initial={initial}
          mode="add"
          isLoading={isLoading}
          onSave={onSave}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditBatchDialogProps extends BatchDialogProps {
  batch: BatchDto | null;
}

export function EditBatchDialog({
  batch,
  open,
  onOpenChange,
  isLoading,
  onSave,
}: EditBatchDialogProps) {
  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <BatchForm
          initial={batch}
          mode="edit"
          isLoading={isLoading}
          onSave={onSave}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
