import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ItemForm, type ItemFormData } from './ItemForm';

export { type ItemFormData };

// ─── Types ──────────────────────────────────────────────────────────────────
interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ItemFormData) => void;
  initialData?: ItemFormData | null;
  mode: 'add' | 'edit';
}

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
}

// ─── Components ──────────────────────────────────────────────────────────────

export const ItemDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: ItemDialogProps) => {
  const handleFormSubmit = (data: ItemFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Item' : 'Edit Item'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Enter the details for the new inventory item.'
              : 'Update the information for this inventory item.'}
          </DialogDescription>
        </DialogHeader>
        <ItemForm
          initialData={initialData}
          mode={mode}
          onSubmit={handleFormSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export const DeleteItemAlertDialog = ({
  open,
  onOpenChange,
  onConfirm,
  itemName,
}: DeleteAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{' '}
            <span className="font-semibold text-foreground">"{itemName}"</span> and remove its
            record from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
