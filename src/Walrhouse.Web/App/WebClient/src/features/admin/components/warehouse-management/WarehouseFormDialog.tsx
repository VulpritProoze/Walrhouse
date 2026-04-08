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

export interface WarehouseInfo {
  id: string;
  code: string;
  name: string;
  location?: string;
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
  const [name, setName] = useState(initial.name ?? '');
  const [location, setLocation] = useState(initial.location ?? '');

  React.useEffect(() => {
    // sync initial when changed
    setName(initial.name ?? '');
    setLocation(initial.location ?? '');
  }, [initial]);

  const isAdd = mode === 'add' || (!mode && !initial?.id);

  function handleSave() {
    const updated: WarehouseInfo = { ...initial, name, location };
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

      <div className="grid gap-2">
        <label className="text-sm text-muted-foreground">Code</label>
        <input
          readOnly={!isAdd}
          value={isAdd ? (initial.code ?? '') : initial.code}
          onChange={isAdd ? (e) => (initial.code = e.target.value) : undefined}
          className={`rounded-md border px-2 py-1 text-sm ${!isAdd ? 'bg-muted/10' : ''}`}
          placeholder={isAdd ? 'Unique warehouse code (e.g. W-MAIN)' : ''}
        />

        <label className="text-sm text-muted-foreground">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm"
          placeholder="Warehouse name"
        />

        <label className="text-sm text-muted-foreground">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm"
          placeholder="Location"
        />
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
