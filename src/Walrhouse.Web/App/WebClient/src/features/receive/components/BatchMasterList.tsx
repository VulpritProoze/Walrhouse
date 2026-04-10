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
import {
  useDeleteBatch,
  useCreateBatch,
  useUpdateBatch,
} from '@/features/batch/hooks/mutations/use-batch-mutation';
import { AddBatchDialog, EditBatchDialog } from './batch-management/BatchDialogs';
import { Loader2, MoreVertical, Edit, Trash2 } from 'lucide-react';

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

  const batches = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [active, setActive] = useState<BatchDto | null>(null);

  const openAdd = () => {
    setActive(null);
    setIsAddOpen(true);
  };

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

  return (
    <Card className="border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="text-sm font-semibold">Batch Master</h3>
          <div className="flex items-center gap-2">
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
              batches.map((batch: BatchDto) => (
                <TableRow
                  key={batch.batchNumber}
                  className="hover:bg-muted/10 group cursor-default"
                >
                  <TableCell className="font-mono font-bold text-xs">{batch.batchNumber}</TableCell>
                  <TableCell>{batch.itemCode}</TableCell>
                  <TableCell>{batch.binNo}</TableCell>
                  <TableCell>{batch.expiryDate}</TableCell>
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
