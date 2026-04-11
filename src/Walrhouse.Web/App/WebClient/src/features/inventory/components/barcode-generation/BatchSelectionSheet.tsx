import { Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface BatchSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (batchNumber: string) => void;
  batches: string[];
}

export function BatchSelectionSheet({
  open,
  onOpenChange,
  onSelect,
  batches,
}: BatchSelectionSheetProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBatches = batches.filter((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Select Batch</SheetTitle>
          <SheetDescription>Search and select a created batch.</SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-auto max-h-[calc(100vh-200px)] border rounded-md">
            <ul className="divide-y">
              {filteredBatches.length === 0 ? (
                <li className="p-4 text-center text-muted-foreground">No batches found.</li>
              ) : (
                filteredBatches.map((b) => (
                  <li
                    key={b}
                    className="p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center transition-colors"
                    onClick={() => {
                      onSelect(b);
                      onOpenChange(false);
                    }}
                  >
                    <span className="font-mono text-sm truncate">{b}</span>
                    <span className="text-[10px] font-bold uppercase text-primary/70">Select</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
