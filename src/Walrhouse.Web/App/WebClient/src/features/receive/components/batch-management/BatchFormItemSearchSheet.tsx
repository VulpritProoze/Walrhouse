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
import { Search, Loader2, Check } from 'lucide-react';
import { useItems } from '@/features/item/hooks/queries/use-item';
import type { ItemDto } from '@/features/inventory/types';

interface BatchFormItemSearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCode: string | null;
  onSelect: (itemCode: string) => void;
  disabled?: boolean;
}

export function BatchFormItemSearchSheet({
  open,
  onOpenChange,
  selectedCode,
  onSelect,
}: BatchFormItemSearchSheetProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  const { data: itemsData, isLoading } = useItems({
    pageNumber: page,
    pageSize: pageSize,
    searchTerm: searchTerm,
  });

  const items = itemsData?.items ?? [];
  const totalPages = itemsData?.totalPages ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Select Item</SheetTitle>
          <SheetDescription>Search and select the item code for this batch.</SheetDescription>
        </SheetHeader>

        <div className="px-4 py-4 space-y-4 flex flex-col h-full">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex-1 overflow-auto rounded-md border min-h-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      No items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item: ItemDto) => (
                    <TableRow
                      key={item.itemCode}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onSelect(item.itemCode);
                        onOpenChange(false);
                      }}
                    >
                      <TableCell className="font-mono font-bold text-xs">{item.itemCode}</TableCell>
                      <TableCell className="text-sm">{item.itemName}</TableCell>
                      <TableCell>
                        {selectedCode === item.itemCode && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="py-2 mt-auto border-t bg-muted/5">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
