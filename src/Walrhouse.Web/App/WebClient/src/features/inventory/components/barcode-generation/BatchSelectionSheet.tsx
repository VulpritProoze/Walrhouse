import { Search, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useBatches } from '@/features/batch/hooks/queries';
import { type BatchDto } from '../../types';

interface BatchSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (batchNumber: string) => void;
}

export function BatchSelectionSheet({ open, onOpenChange, onSelect }: BatchSelectionSheetProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useBatches({
    pageSize: 50,
  });

  const batches = data?.items ?? [];

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
              {isLoading ? (
                <li className="p-8 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mb-2" />
                  <span className="text-sm">Loading batches...</span>
                </li>
              ) : batches.length === 0 ? (
                <li className="p-4 text-center text-muted-foreground">No batches found.</li>
              ) : (
                batches.map((b: BatchDto) => (
                  <li
                    key={b.batchNumber}
                    className="p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center transition-colors"
                    onClick={() => {
                      onSelect(b.batchNumber);
                      onOpenChange(false);
                    }}
                  >
                    <span className="font-mono text-sm truncate">{b.batchNumber}</span>
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
