import { useState } from 'react';
import { ItemGroup } from '@/features/item/types/enums';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ItemDialog, DeleteItemAlertDialog } from './item-management/ItemDialogs';
import { useItems } from '@/features/item/hooks/queries/use-item';
import { useUoMGroup } from '@/features/uom-group/hooks/queries/use-uom-group';
import {
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '@/features/item/hooks/mutations/use-item-mutation';
import { type ItemDto } from '../types';
import { logger } from '@/lib/utils/logger';
import { toast } from 'sonner';
import type { CreateItemRequest } from '@/features/item/api';

export function ItemsMasterList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Queries & Mutations
  const { data, isLoading } = useItems({
    pageNumber: page,
    pageSize: pageSize,
    searchTerm: searchTerm || undefined,
  });

  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null);

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ItemDto | null>(null);

  const BaseUoM = ({ uoMGroupId }: { uoMGroupId: number }) => {
    const { data: uoMGroup, isLoading } = useUoMGroup(uoMGroupId, !!uoMGroupId);

    if (!uoMGroupId) return '-';
    if (isLoading) return '...';
    if (!uoMGroup) return uoMGroupId;

    return uoMGroup.baseUoM;
  };

  const handleOpenAdd = () => {
    setDialogMode('add');
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: ItemDto) => {
    setDialogMode('edit');
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: ItemDto) => {
    setDeletingItem(item);
    setDeleteAlertOpen(true);
  };

  const onSave = async (itemData: ItemDto) => {
    if (dialogMode === 'add') {
      if (!itemData.uoMGroupId) {
        toast.error('Failed to create item: UoM Group is required');
        return;
      }
      await createMutation.mutateAsync({
        ...itemData,
        uoMGroupId: itemData.uoMGroupId,
      } as CreateItemRequest);
    } else {
      await updateMutation.mutateAsync({
        itemCode: itemData.itemCode,
        data: itemData,
      });
    }
  };

  const onConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMutation.mutateAsync(deletingItem.itemCode);
      setDeleteAlertOpen(false);
      setDeletingItem(null);
    } catch (err) {
      logger.error('Failed to delete item', err);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <ItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedItem}
        onSave={onSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-100 flex flex-col justify-between">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-32">Item Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-32">Group</TableHead>
                <TableHead className="w-48">Remarks</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading items...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: ItemDto) => (
                  <TableRow key={item.itemCode} className="hover:bg-muted/10 group cursor-default">
                    <TableCell className="font-mono font-bold text-xs uppercase">
                      {item.itemCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.itemName}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">
                        Base UOM: <BaseUoM uoMGroupId={item.uoMGroupId || 0} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">
                        {Object.keys(ItemGroup).find(
                          (key) => ItemGroup[key as keyof typeof ItemGroup] === item.itemGroup,
                        ) || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-37.5">
                      {item.remarks || '-'}
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
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="gap-2" onClick={() => handleOpenEdit(item)}>
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() => handleOpenDelete(item)}
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

        {/* Improved Pagination Controls following BinView pattern */}
        <div className="p-4 border-t bg-muted/5 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing {items.length} of {totalCount} items
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Rows</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  if (v) {
                    setPageSize(parseInt(v));
                    setPage(1);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs font-medium">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <DeleteItemAlertDialog
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        itemName={deletingItem?.itemName || ''}
        onConfirm={onConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
