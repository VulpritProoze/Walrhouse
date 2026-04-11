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
import { useUoMGroups } from '@/features/uom-group/hooks/queries/use-uom-group';
import type { UoMGroupDto } from '@/features/receive/types/uomgroup-dto';

interface ItemFormUoMGroupSearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: number | null;
  onSelect: (uomGroup: UoMGroupDto) => void;
  disabled?: boolean;
}

export function ItemFormUoMGroupSearchSheet({
  open,
  onOpenChange,
  selectedId,
  onSelect,
  disabled,
}: ItemFormUoMGroupSearchSheetProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: uomGroupsData, isLoading } = useUoMGroups({
    pageNumber: page,
    pageSize: pageSize,
  });

  const uomGroups = uomGroupsData?.items ?? [];
  const totalPages = uomGroupsData?.totalPages ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(true);
          }}
        >
          <Search className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Select UoM Group</SheetTitle>
          <SheetDescription>
            Search and select the Unit of Measure group for this item.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-4 space-y-4 flex flex-col h-full">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search UoM groups..." className="pl-9" />
          </div>

          <div className="flex-1 overflow-auto rounded-md border min-h-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-24">ID</TableHead>
                  <TableHead>Base UoM</TableHead>
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
                ) : uomGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      No UoM groups found.
                    </TableCell>
                  </TableRow>
                ) : (
                  uomGroups.map((u: UoMGroupDto) => (
                    <TableRow
                      key={u.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onSelect(u);
                        onOpenChange(false);
                      }}
                    >
                      <TableCell className="font-mono font-bold text-xs">{u.id}</TableCell>
                      <TableCell className="text-sm">{u.baseUoM}</TableCell>
                      <TableCell>
                        {selectedId === u.id && <Check className="h-4 w-4 text-primary" />}
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
