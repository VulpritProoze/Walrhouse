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
import { useSalesOrders } from '@/features/sales-order/hooks/queries';
import type { IncomingOrderDto } from '@/features/receive/types/incoming-order-dto';

interface OrderSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: number | null;
  onSelect: (order: IncomingOrderDto) => void;
}

export function OrderSelectionSheet({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: OrderSelectionSheetProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  const { data: ordersData, isLoading } = useSalesOrders({
    pageNumber: page,
    pageSize: pageSize,
  });

  const orders = ordersData?.items ?? [];
  const totalPages = ordersData?.totalPages ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Select Sales Order</SheetTitle>
          <SheetDescription>
            Search and select the order to generate a barcode for.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-4 space-y-4 flex flex-col h-full">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
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
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: IncomingOrderDto) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onSelect(order);
                        onOpenChange(false);
                      }}
                    >
                      <TableCell className="font-mono font-bold text-xs">{order.id}</TableCell>
                      <TableCell className="text-sm">{order.customerName}</TableCell>
                      <TableCell>
                        {selectedId === order.id && <Check className="h-4 w-4 text-primary" />}
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
