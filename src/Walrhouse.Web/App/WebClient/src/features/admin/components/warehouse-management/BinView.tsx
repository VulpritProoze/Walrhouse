import { Edit, MoreVertical, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AddBinDialog, EditBinDialog } from './BinDialogs';
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useBins } from '@/features/bin/hooks/queries/use-bin';
import {
  useCreateBin,
  useUpdateBin,
  useDeleteBin,
} from '@/features/bin/hooks/mutations/use-bin-mutation';
import { type BinDto } from '@/features/bin/types';
import { logger } from '@/lib/utils/logger';

export function BinView() {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const { data, isLoading } = useBins({
    pageNumber: page,
    pageSize: pageSize,
  });

  const createMutation = useCreateBin();
  const updateMutation = useUpdateBin();
  const deleteMutation = useDeleteBin();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<{
    binNo: string;
    binName: string;
    warehouseCode: string;
  } | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<null | { binNo: string; binName: string }>(null);
  const [confirmInput, setConfirmInput] = React.useState('');

  const openDelete = (b: { binNo: string; binName: string }) => {
    setDeleting(b);
    setConfirmInput('');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const expectedExact = `delete ${deleting.binName}`;
    if (confirmInput.trim() !== expectedExact) return;

    try {
      await deleteMutation.mutateAsync(deleting.binNo);
      setDeleteDialogOpen(false);
      setDeleting(null);
      setConfirmInput('');
    } catch (err) {
      logger.error('Failed to delete bin', err);
    }
  };

  const bins = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <EditBinDialog
        bin={selected}
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setSelected(null);
        }}
        isLoading={updateMutation.isPending}
        onSave={async (updated) => {
          await updateMutation.mutateAsync({
            binNo: updated.binNo,
            data: {
              binName: updated.binName,
              warehouseCode: updated.warehouseCode,
            },
          });
        }}
      />

      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Bin Locations</h4>
          <p className="text-sm text-muted-foreground">Manage specific storage slots and racks.</p>
        </div>
        <AddBinDialog
          isLoading={createMutation.isPending}
          onSave={async (created) => {
            await createMutation.mutateAsync({
              binNo: created.binNo,
              binName: created.binName,
              warehouseCode: created.warehouseCode,
            });
          }}
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Bin No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading bins...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : bins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No bins found.
                  </TableCell>
                </TableRow>
              ) : (
                (bins as BinDto[]).map((b) => (
                  <TableRow key={b.binNo} className="hover:bg-muted/10 group cursor-default">
                    <TableCell className="font-mono font-bold text-xs">{b.binNo}</TableCell>
                    <TableCell>{b.binName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {b.warehouseCode}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
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
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => {
                              setSelected({
                                binNo: b.binNo,
                                binName: b.binName,
                                warehouseCode: b.warehouseCode,
                              });
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() =>
                              openDelete({
                                binNo: b.binNo,
                                binName: b.binName,
                              })
                            }
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
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bin{' '}
              <span className="font-bold text-foreground">"{deleting?.binName}"</span> and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Please type{' '}
              <span className="font-mono font-bold text-foreground selection:bg-primary/20">
                delete {deleting?.binName}
              </span>{' '}
              to confirm.
            </p>
            <Input
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Type confirmation here"
              className={
                confirmInput && confirmInput !== `delete ${deleting?.binName}`
                  ? 'border-destructive'
                  : ''
              }
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={confirmInput !== `delete ${deleting?.binName}` || deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete Bin'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
