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
import { type UoMGroupDto } from '../types/uomgroup-dto';
import { useState } from 'react';
import { useUoMGroups } from '@/features/uom-group/hooks/queries/use-uom-group';
import {
  useDeleteUoMGroup,
  useCreateUoMGroup,
  useUpdateUoMGroup,
} from '@/features/uom-group/hooks/mutations/use-uom-group-mutation';
import { AddUoMGroupDialog, EditUoMGroupDialog } from './uomgroup-management/UoMGroupDialogs';
import { Loader2, MoreVertical, Edit, Trash2 } from 'lucide-react';

export const UoMGroupManagement = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useUoMGroups({
    pageNumber: page,
    pageSize: pageSize,
  });
  const { mutate: deleteUoMGroup, isPending: isDeleting } = useDeleteUoMGroup();
  const { mutateAsync: createUoMGroup, isPending: isCreating } = useCreateUoMGroup();
  const { mutateAsync: updateUoMGroup, isPending: isUpdating } = useUpdateUoMGroup();

  const groups = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [active, setActive] = useState<UoMGroupDto | null>(null);

  const openAdd = () => {
    setActive(null);
    setIsAddOpen(true);
  };

  const openEdit = (g: UoMGroupDto) => {
    setActive(g);
    setIsEditOpen(true);
  };

  const openDelete = (g: UoMGroupDto) => {
    setActive(g);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!active) return;
    deleteUoMGroup(active.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setActive(null);
      },
    });
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="text-sm font-semibold">UoM Group Master</h3>
          <div className="flex items-center gap-2">
            <Button onClick={openAdd}>Add UoM Group</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>ID</TableHead>
              <TableHead>Base UoM</TableHead>
              <TableHead>Conversion Factors</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading groups...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No UoM groups found.
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group: UoMGroupDto) => (
                <TableRow key={group.id} className="hover:bg-muted/10 group cursor-default">
                  <TableCell className="font-mono font-bold text-xs">{group.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.baseUoMName}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {group.uoMGroupLines.map((line, idx) => (
                        <span key={idx} className="text-xs text-muted-foreground">
                          {idx > 0 && ' | '}1 {line.uoMName} = {line.baseQty} {group.baseUoMName}
                        </span>
                      ))}
                    </div>
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
                        <DropdownMenuItem className="gap-2" onClick={() => openEdit(group)}>
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => openDelete(group)}
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
      <AddUoMGroupDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        isLoading={isCreating}
        onSave={async (data) => {
          await createUoMGroup({
            baseUoMName: data.baseUoMName,
            uoMGroupLines: data.uoMGroupLines.map((l) => ({
              uoMName: l.uoMName,
              baseQty: l.baseQty,
            })),
          });
        }}
      />

      <EditUoMGroupDialog
        initialData={active}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        isLoading={isUpdating}
        onSave={async (data) => {
          await updateUoMGroup({
            id: data.id,
            data: {
              baseUoMName: data.baseUoMName,
              uoMGroupLines: data.uoMGroupLines.map((l) => ({
                uoMName: l.uoMName,
                baseQty: l.baseQty,
              })),
            },
          });
        }}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete UoM Group</DialogTitle>
            <DialogDescription>Delete UoM Group #{active?.id}</DialogDescription>
          </DialogHeader>

          <div className="py-2 text-sm">
            Are you sure you want to delete UoM group <strong>#{active?.id}</strong> (
            {active?.baseUoMName})?
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
