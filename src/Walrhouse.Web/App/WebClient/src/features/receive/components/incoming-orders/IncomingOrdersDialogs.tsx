import { Dialog, DialogContent } from '@/components/ui/dialog';
import { IncomingOrderForm } from './IncomingOrdersForm';
import { type IncomingOrderDto, IncomingOrderStatus } from '../../types/incoming-order-dto';

interface IncomingOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onSave: (data: IncomingOrderDto) => Promise<void>;
}

export function AddIncomingOrderDialog({
  open,
  onOpenChange,
  isLoading,
  onSave,
}: IncomingOrderDialogProps) {
  const initial: IncomingOrderDto = {
    id: 0,
    customerName: '',
    remarks: '',
    dueDate: new Date().toISOString(),
    status: IncomingOrderStatus.Open,
    orderLines: [],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <IncomingOrderForm
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

interface EditIncomingOrderDialogProps extends IncomingOrderDialogProps {
  order: IncomingOrderDto | null;
}

export function EditIncomingOrderDialog({
  order,
  open,
  onOpenChange,
  isLoading,
  onSave,
}: EditIncomingOrderDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <IncomingOrderForm
          initial={order}
          mode="edit"
          isLoading={isLoading}
          onSave={onSave}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
