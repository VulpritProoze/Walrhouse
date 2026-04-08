import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface WarehouseInfo {
  id: string;
  code: string;
  name: string;
}

interface PropsExtended {
  initial: WarehouseInfo;
  onSave?: (updated: WarehouseInfo) => void;
  /** Optional custom trigger element for uncontrolled mode (must be a React element) */
  trigger?: React.ReactElement;
  /** mode: 'add' for creating a new warehouse, 'edit' for updating existing */
  mode?: 'add' | 'edit';
}

export function WarehouseFormDialog({
  initial,
  onSave,
  open,
  onOpenChange,
  trigger,
  mode,
}: PropsExtended & { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [code, setCode] = useState(initial.code ?? '');
  const [name, setName] = useState(initial.name ?? '');

  React.useEffect(() => {
    // sync initial when changed
    setCode(initial.code ?? '');
    setName(initial.name ?? '');
  }, [initial]);

  const isAdd = mode === 'add' || (!mode && !initial?.id);

  function handleSave() {
    const updated: WarehouseInfo = { ...initial, code, name };
    onSave?.(updated);
    onOpenChange?.(false);
  }

  const Content = (
    <DialogContent showCloseButton>
      <DialogTitle>{isAdd ? 'Add Warehouse' : 'Edit Warehouse'}</DialogTitle>
      <DialogDescription>
        {isAdd
          ? 'Create a new warehouse. Fill required fields and click Create.'
          : 'Update warehouse details — changes are saved on Save.'}
      </DialogDescription>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Warehouse Code
          </label>
          <Input
            disabled={!isAdd}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. W-MAIN"
            className={!isAdd ? 'bg-muted/50 cursor-not-allowed' : ''}
          />
          <p className="text-[0.8rem] text-muted-foreground">
            Unique identifier for the warehouse.
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Warehouse Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose onClick={handleSave}>
          <Button>{isAdd ? 'Create' : 'Save'}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );

  if (typeof open === 'boolean') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {Content}
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          (trigger as React.ReactElement) ?? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )
        }
      />
      {Content}
    </Dialog>
  );
}

export default WarehouseFormDialog;
