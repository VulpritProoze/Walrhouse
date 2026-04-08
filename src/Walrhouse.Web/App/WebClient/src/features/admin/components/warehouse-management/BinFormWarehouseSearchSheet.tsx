import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Check } from 'lucide-react';
import { useWarehouses } from '@/features/warehouse/hooks/queries/use-warehouse';
import type { WarehouseDto } from '@/features/warehouse/types';

interface BinFormWarehouseSearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCode: string;
  onSelect: (code: string) => void;
  disabled?: boolean;
}

export function BinFormWarehouseSearchSheet({
  open,
  onOpenChange,
  selectedCode,
  onSelect,
  disabled,
}: BinFormWarehouseSearchSheetProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: warehousesData, isLoading } = useWarehouses({
    pageNumber: page,
    pageSize: pageSize,
  });

  const warehouses = warehousesData?.items ?? [];
  const totalPages = warehousesData?.totalPages ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" disabled={disabled}>
            <Search className="h-4 w-4" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Select Warehouse</SheetTitle>
          <SheetDescription>
            Search and select the warehouse for this bin location.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-4 space-y-4 flex flex-col h-full">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search warehouses..." className="pl-9" />
          </div>

          <div className="flex-1 overflow-auto rounded-md border min-h-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-24">Code</TableHead>
                  <TableHead>Name</TableHead>
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
                ) : warehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      No warehouses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  warehouses.map((w: WarehouseDto) => (
                    <TableRow
                      key={w.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onSelect(w.warehouseCode);
                        onOpenChange(false);
                      }}
                    >
                      <TableCell className="font-mono font-bold text-xs uppercase">
                        {w.warehouseCode}
                      </TableCell>
                      <TableCell className="text-sm">{w.warehouseName}</TableCell>
                      <TableCell>
                        {selectedCode === w.warehouseCode && (
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
