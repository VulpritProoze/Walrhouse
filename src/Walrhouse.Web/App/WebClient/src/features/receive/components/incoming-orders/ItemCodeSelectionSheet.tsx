import { Search, Loader2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useItems } from '@/features/item/hooks/queries/use-item';

/**
 * Basic DTO for Item from item service
 */
export interface ItemDto {
  itemCode: string;
  itemName: string;
  uoMGroupId: number;
}

interface ItemCodeSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (itemCode: string) => void;
}

export function ItemCodeSelectionSheet({
  open,
  onOpenChange,
  onSelect,
}: ItemCodeSelectionSheetProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const { data, isLoading } = useItems({
    pageNumber: page,
    pageSize,
    searchTerm: searchTerm || undefined,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Select Item Code</SheetTitle>
          <SheetDescription>Search and select an item from master data.</SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search items by code or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="overflow-auto max-h-[calc(100vh-200px)] border rounded-md">
            <ul className="divide-y">
              {isLoading ? (
                <li className="p-8 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mb-2" />
                  <span className="text-sm">Loading items...</span>
                </li>
              ) : items.length === 0 ? (
                <li className="p-4 text-center text-muted-foreground">No items found.</li>
              ) : (
                items.map((item: ItemDto) => (
                  <li
                    key={item.itemCode}
                    className="p-3 hover:bg-muted/50 cursor-pointer flex flex-col gap-1 transition-colors"
                    onClick={() => {
                      onSelect(item.itemCode);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm font-bold">{item.itemCode}</span>
                      <span className="text-[10px] font-bold uppercase text-primary/70">
                        Select
                      </span>
                    </div>

                    {totalPages > 1 && (
                      <div className="p-3 border-t bg-muted/5">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className={
                                  page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                                }
                              />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                              <PaginationItem key={p}>
                                <PaginationLink
                                  isActive={page === p}
                                  onClick={() => setPage(p)}
                                  className="cursor-pointer"
                                >
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className={
                                  page === totalPages
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground truncate">{item.itemName}</span>
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
