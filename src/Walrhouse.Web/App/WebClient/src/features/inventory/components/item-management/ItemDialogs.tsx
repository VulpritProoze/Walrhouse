import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { AddItemForm, EditItemForm } from './ItemForm';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ItemDto } from '../../types';

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData?: ItemDto | null;
  onSave: (data: ItemDto) => Promise<void>;
  isLoading?: boolean;
}

export const ItemDialog = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSave,
  isLoading,
}: ItemDialogProps) => {
  const isAdd = mode === 'add';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-2">
          <DialogTitle>{isAdd ? 'Add Item' : 'Edit Item'}</DialogTitle>
          <DialogDescription>
            {isAdd ? 'Create a new inventory item.' : 'Update the details for this item.'}
          </DialogDescription>
        </div>

        {isAdd ? (
          <AddItemForm
            onSave={onSave}
            onSuccess={() => onOpenChange(false)}
            isLoading={isLoading}
            renderFooter={(loading, handleSave) => (
              <DialogFooter className="p-6 pt-2">
                <DialogClose
                  render={
                    <Button variant="outline" disabled={loading}>
                      Cancel
                    </Button>
                  }
                />
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Create'}
                </Button>
              </DialogFooter>
            )}
          />
        ) : (
          initialData && (
            <EditItemForm
              initial={initialData}
              onSave={onSave}
              onSuccess={() => onOpenChange(false)}
              isLoading={isLoading}
              renderFooter={(loading, handleSave) => (
                <DialogFooter className="p-6 pt-2">
                  <DialogClose
                    render={
                      <Button variant="outline" disabled={loading}>
                        Cancel
                      </Button>
                    }
                  />
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              )}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

interface DeleteItemAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const DeleteItemAlertDialog = ({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  isLoading,
}: DeleteItemAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item{' '}
            <span className="font-bold text-foreground">"{itemName}"</span> and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
