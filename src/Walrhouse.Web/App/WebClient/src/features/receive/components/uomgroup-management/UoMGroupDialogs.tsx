import { Dialog, DialogContent } from '@/components/ui/dialog';
import { type UoMGroupDto } from '../../types/uomgroup-dto';
import { UoMGroupForm } from './UoMGroupForm';

interface UoMGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UoMGroupDto) => Promise<void>;
  isLoading: boolean;
  initialData?: UoMGroupDto | null;
}

export const AddUoMGroupDialog = ({
  open,
  onOpenChange,
  onSave,
  isLoading,
}: Omit<UoMGroupDialogProps, 'initialData'>) => {
  const initial: UoMGroupDto = {
    id: 0,
    baseUoMName: '',
    uoMGroupLines: [],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <UoMGroupForm
          mode="add"
          initial={initial}
          onSave={onSave}
          isLoading={isLoading}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export const EditUoMGroupDialog = ({
  open,
  onOpenChange,
  onSave,
  isLoading,
  initialData,
}: UoMGroupDialogProps) => {
  if (!initialData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <UoMGroupForm
          mode="edit"
          initial={initialData}
          onSave={onSave}
          isLoading={isLoading}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
