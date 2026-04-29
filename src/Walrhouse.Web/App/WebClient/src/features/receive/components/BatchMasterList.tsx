import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type BatchDto } from '../types/batch-dto';
import { BatchStatus } from '@/features/batch/types';
import { useState } from 'react';
import { useBatches } from '@/features/batch/hooks/queries/use-batch';
import { useQuery } from '@tanstack/react-query';
import { getItem } from '@/features/item/api/item.service';
import {
  useDeleteBatch,
  useCreateBatch,
  useUpdateBatch,
} from '@/features/batch/hooks/mutations/use-batch-mutation';
import { AddBatchDialog, EditBatchDialog } from './batch-management/BatchDialogs';
import { Loader2, MoreVertical, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { parseISO } from 'date-fns';

export const BatchMasterList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useBatches({
    pageNumber: page,
    pageSize: pageSize,
  });
  const { mutate: deleteBatch, isPending: isDeleting } = useDeleteBatch();
  const { mutateAsync: createBatch, isPending: isCreating } = useCreateBatch();
  const { mutateAsync: updateBatch, isPending: isUpdating } = useUpdateBatch();

  const batches: BatchDto[] = (data?.items ?? []) as BatchDto[];
  const totalPages = data?.totalPages ?? 0;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [active, setActive] = useState<BatchDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openAdd = () => {
    setActive(null);
    setIsAddOpen(true);
  };

  // Prefetch item details for current page batches
  const itemCodesOnPage = Array.from(
    new Set(batches.map((b: BatchDto) => b.itemCode).filter((c): c is string => !!c)),
  );

  const { data: itemsData } = useQuery<Record<string, { itemName?: string }>>({
    queryKey: ['items', 'byCodes', itemCodesOnPage],
    queryFn: async () => {
      const results: Array<{ itemName?: string } | null> = await Promise.all(
        itemCodesOnPage.map(async (c) => {
          try {
            const r = await getItem(c);
            return r.data as { itemName?: string };
          } catch {
            return null;
          }
        }),
      );

      const map: Record<string, { itemName?: string }> = {};
      itemCodesOnPage.forEach((code, i) => {
        const res = results[i];
        map[code] = res ? { itemName: res.itemName } : { itemName: undefined };
      });

      return map;
    },
    enabled: itemCodesOnPage.length > 0,
  });

  const codeToName: Record<string, { itemName?: string }> = itemsData ?? {};

  // Client-side search over batchNumber, itemCode, itemName
  const filteredBatches = batches.filter((b: BatchDto) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const itemName = (codeToName[b.itemCode as string]?.itemName ?? '').toLowerCase();
    return (
      (b.batchNumber ?? '').toLowerCase().includes(q) ||
      (b.itemCode ?? '').toLowerCase().includes(q) ||
      itemName.includes(q)
    );
  });

  const openEdit = (b: BatchDto) => {
    setActive(b);
    setIsEditOpen(true);
  };

  const openDelete = (b: BatchDto) => {
    setActive(b);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!active) return;
    deleteBatch(active.batchNumber, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setActive(null);
      },
    });
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case BatchStatus.Released:
        return 'Released';
      case BatchStatus.Locked:
        return 'Locked';
      case BatchStatus.Restricted:
        return 'Restricted';
      default:
        return 'Pending';
    }
  };

  const formatExpiry = (d?: string | null) => {
    if (!d) return '';
    // If it's a plain date like YYYY-MM-DD, convert directly
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      return `${d}T00:00:00+00:00`;
    }

    let dt: Date;
    if (typeof d === 'string') {
      try {
        dt = parseISO(d);
      } catch {
        dt = new Date(d);
      }
    } else {
      dt = d as Date;
    }

    if (isNaN(dt.getTime())) return String(d);
    // toISOString -> "YYYY-MM-DDTHH:mm:ss.sssZ" -> replace Z with +00:00 and drop milliseconds
    return dt.toISOString().replace(/\.\d{3}Z$/, '+00:00');
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="text-sm font-semibold">Batch Master</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md px-2 bg-muted/5">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batches or items"
                className="w-56 bg-transparent border-0 p-0"
              />
            </div>
            <Button onClick={openAdd}>Add Batch</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Batch ID</TableHead>
              <TableHead>Item Code</TableHead>
              <TableHead>Bin No</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading batches...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No batches found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBatches.map((batch: BatchDto) => (
                <TableRow
                  key={batch.batchNumber}
                  className="hover:bg-muted/10 group cursor-default"
                >
                  <TableCell className="font-mono font-bold text-xs">{batch.batchNumber}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {codeToName[batch.itemCode as string]?.itemName ?? batch.itemCode}
                    </div>
                    <div className="text-xs text-muted-foreground">{batch.itemCode}</div>
                  </TableCell>
                  <TableCell>{batch.binNo}</TableCell>
                  <TableCell>{formatExpiry(batch.expiryDate)}</TableCell>
                  <TableCell>
                    <Badge variant={batch.status === BatchStatus.Released ? 'success' : 'outline'}>
                      {getStatusLabel(batch.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => openEdit(batch)}>
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => openDelete(batch)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t bg-muted/5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                    page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs */}
      <AddBatchDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        isLoading={isCreating}
        onSave={async (data) => {
          await createBatch(data);
        }}
      />

      <EditBatchDialog
        batch={active}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        isLoading={isUpdating}
        onSave={async (data) => {
          await updateBatch({ batchNumber: data.batchNumber, data });
        }}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Batch</DialogTitle>
            <DialogDescription>Delete batch {active?.batchNumber}</DialogDescription>
          </DialogHeader>

          <div className="py-2 text-sm">
            Are you sure you want to delete batch <strong>{active?.batchNumber}</strong>?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
