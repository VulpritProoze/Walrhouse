import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Check, X } from 'lucide-react';
import { useBatches } from '@/features/batch/hooks/queries/use-batch';
import type { BatchDto } from '../../types/batch-dto';
import { Badge } from '@/components/ui/badge';

interface BatchSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBatchNumbers: string[];
  onSelect: (batchNumbers: string[]) => void;
}

export function BatchSelectionSheet({
  open,
  onOpenChange,
  selectedBatchNumbers,
  onSelect,
}: BatchSelectionSheetProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelection, setTempSelection] = useState<string[]>([]);
  const pageSize = 10;

  // Sync temp selection when sheet opens
  useState(() => {
    if (open) {
      setTempSelection(selectedBatchNumbers);
    }
  });

  // Re-sync if selectedBatchNumbers changes and sheet is open
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempSelection(selectedBatchNumbers);
    }
    onOpenChange(newOpen);
  };

  const { data: batchesData, isLoading } = useBatches({
    pageNumber: page,
    pageSize: pageSize,
    // Note: Assuming API supports search, if not we'd filter client-side or wait for API update
  });

  const batches = batchesData?.items ?? [];
  const totalPages = batchesData?.totalPages ?? 0;

  const toggleBatch = (batchNumber: string) => {
    setTempSelection((prev) =>
      prev.includes(batchNumber) ? prev.filter((b) => b !== batchNumber) : [...prev, batchNumber],
    );
  };

  const handleApply = () => {
    onSelect(tempSelection);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Select Batches</SheetTitle>
          <SheetDescription>Choose multiple batches for this order line.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 gap-4 overflow-hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {tempSelection.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md border min-h-[40px]">
              {tempSelection.map((batch) => (
                <Badge key={batch} variant="secondary" className="pl-2 pr-1 py-0 h-6">
                  {batch}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-transparent"
                    onClick={() => toggleBatch(batch)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[150px]">Batch No</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Bin</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : batches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No batches found.
                    </TableCell>
                  </TableRow>
                ) : (
                  batches.map((batch: BatchDto) => {
                    const isSelected = tempSelection.includes(batch.batchNumber);
                    return (
                      <TableRow
                        key={batch.batchNumber}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleBatch(batch.batchNumber)}
                      >
                        <TableCell className="font-mono font-bold text-xs">
                          {batch.batchNumber}
                        </TableCell>
                        <TableCell className="text-xs">{batch.itemCode}</TableCell>
                        <TableCell className="text-xs">{batch.binNo}</TableCell>
                        <TableCell>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="py-2 border-t bg-muted/5">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <div className="flex items-center text-xs text-muted-foreground px-2">
                    Page {page} of {totalPages}
                  </div>
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={
                        page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t mt-auto">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Apply {tempSelection.length > 0 && `(${tempSelection.length})`}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
