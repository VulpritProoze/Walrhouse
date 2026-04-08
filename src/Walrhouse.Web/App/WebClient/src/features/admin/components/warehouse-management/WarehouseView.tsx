import { Plus, Edit, MoreVertical, Trash2, Loader2 } from 'lucide-react';
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
import { WarehouseFormDialog } from './WarehouseFormDialog';
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
import { useWarehouses } from '@/features/warehouse/hooks/queries';
import {
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from '@/features/warehouse/hooks/mutations';
import { type WarehouseDto } from '@/features/warehouse/types';

export function WarehouseView() {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const { data, isLoading } = useWarehouses({
    pageNumber: page,
    pageSize: pageSize,
  });

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<{
    id: string;
    code: string;
    name: string;
    location?: string;
  } | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<null | { id: string; code: string; name: string }>(
    null,
  );
  const [confirmInput, setConfirmInput] = React.useState('');

  const openDelete = (w: { id: string; code: string; name: string }) => {
    setDeleting(w);
    setConfirmInput('');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const expectedExact = `delete ${deleting.name}`;
    if (confirmInput.trim() !== expectedExact) return;

    try {
      await deleteMutation.mutateAsync(deleting.code);
      setDeleteDialogOpen(false);
      setDeleting(null);
      setConfirmInput('');
    } catch (err) {
      console.error('Failed to delete warehouse', err);
    }
  };

  const warehouses = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Controlled edit dialog rendered at top-level so menu can open it */}
      {selected && (
        <WarehouseFormDialog
          initial={selected}
          open={dialogOpen}
          onOpenChange={(v) => {
            setDialogOpen(v);
            if (!v) setSelected(null);
          }}
          onSave={async (updated) => {
            try {
              await updateMutation.mutateAsync({
                warehouseCode: selected.code,
                data: {
                  warehouseName: updated.name,
                },
              });
              setDialogOpen(false);
              setSelected(null);
            } catch (err) {
              console.error('Update failed', err);
            }
          }}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Warehouses</h4>
          <p className="text-sm text-muted-foreground">Manage physical storage facilities.</p>
        </div>
        <WarehouseFormDialog
          initial={{ id: '', code: '', name: '' }}
          trigger={
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Warehouse
            </Button>
          }
          onSave={async (created) => {
            try {
              await createMutation.mutateAsync({
                warehouseCode: created.code,
                warehouseName: created.name,
              });
            } catch (err) {
              console.error('Create failed', err);
            }
          }}
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
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
                      <span>Loading warehouses...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : warehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No warehouses found.
                  </TableCell>
                </TableRow>
              ) : (
                (warehouses as WarehouseDto[]).map((w) => (
                  <TableRow key={w.id} className="hover:bg-muted/10 group cursor-default">
                    <TableCell className="font-mono font-bold text-xs">{w.warehouseCode}</TableCell>
                    <TableCell>{w.warehouseName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">N/A</TableCell>
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
                                id: w.id,
                                code: w.warehouseCode,
                                name: w.warehouseName ?? '',
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
                                id: w.id,
                                code: w.warehouseCode,
                                name: w.warehouseName ?? '',
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
            <AlertDialogTitle>Delete warehouse</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{deleting ? ` ${deleting.name}` : ''}? This action
              cannot be undone.
            </AlertDialogDescription>
            <div className="mt-3">
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={
                  deleting
                    ? `Type "delete ${deleting.name}" to confirm`
                    : 'Type confirmation to enable delete'
                }
              />
              <p className="text-xs text-muted-foreground mt-2">
                Type{' '}
                <span className="font-mono">
                  delete {deleting ? deleting.name : 'warehouse-name'}
                </span>{' '}
                to enable the Delete button.
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={!(deleting && confirmInput.trim() === `delete ${deleting.name}`)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
