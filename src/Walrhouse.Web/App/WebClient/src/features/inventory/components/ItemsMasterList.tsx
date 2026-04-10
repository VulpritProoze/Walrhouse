import { ItemGroup, BarcodeFormat } from '@/features/item/types/enums';
import { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge/badge.tsx';
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  FileDown,
  FileUp,
  History,
  Edit,
  ArrowRightCircle,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ItemDialog,
  DeleteItemAlertDialog,
  type ItemFormData,
} from './item-management/ItemDialogs';

// ─── Types ──────────────────────────────────────────────────────────────────
export type ItemStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';

export interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  itemGroup: number;
  uoMGroupId: number;
  barcodeValue?: string;
  barcodeFormat?: number;
  remarks?: string;
  lastUpdated: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ITEMS: InventoryItem[] = [
  {
    id: 'itm-001',
    itemCode: 'SKU-WAL-001',
    itemName: 'Industrial Pallet Rack',
    itemGroup: ItemGroup.General,
    uoMGroupId: 1,
    barcodeValue: 'WAL-PR-001',
    barcodeFormat: 1,
    remarks: 'Heavy duty rack for storage',
    lastUpdated: '2026-03-29T09:12:00Z',
  },
  {
    id: 'itm-002',
    itemCode: 'SKU-WAL-002',
    itemName: 'Heavy Duty Crate',
    itemGroup: ItemGroup.General,
    uoMGroupId: 1,
    barcodeValue: 'WAL-CR-002',
    barcodeFormat: 1,
    remarks: 'Plastic crate for small parts',
    lastUpdated: '2026-03-28T14:30:00Z',
  },
  {
    id: 'itm-003',
    itemCode: 'SKU-WAL-003',
    itemName: 'Amoxicillin 500mg',
    itemGroup: ItemGroup.Medicines,
    uoMGroupId: 2,
    barcodeValue: 'MED-AMX-500',
    barcodeFormat: 3,
    remarks: 'Box of 10 blister packs',
    lastUpdated: '2026-03-27T11:00:00Z',
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export const ItemsMasterList = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  // Dialog states
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    item: InventoryItem | null;
  }>({
    open: false,
    mode: 'add',
    item: null,
  });

  const [deleteAlertState, setDeleteAlertState] = useState<{
    open: boolean;
    item: InventoryItem | null;
  }>({
    open: false,
    item: null,
  });

  const filtered = items.filter((item) =>
    `${item.itemCode} ${item.itemName}`.toLowerCase().includes(search.toLowerCase()),
  );

  const isAllSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filtered.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelection = (id: string, shiftKey?: boolean) => {
    const next = new Set(selectedIds);

    if (shiftKey && lastClickedId) {
      const fromIndex = filtered.findIndex((item) => item.id === lastClickedId);
      const toIndex = filtered.findIndex((item) => item.id === id);

      if (fromIndex !== -1 && toIndex !== -1) {
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const range = filtered.slice(start, end + 1);

        range.forEach((item) => next.add(item.id));
        setSelectedIds(next);
        setLastClickedId(id);
        return;
      }
    }

    if (next.has(id)) next.delete(id);
    else next.add(id);

    setSelectedIds(next);
    setLastClickedId(id);
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    clearSelection();
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenAddDialog = () => {
    setDialogState({ open: true, mode: 'add', item: null });
  };

  const handleOpenEditDialog = (item: InventoryItem) => {
    setDialogState({ open: true, mode: 'edit', item });
  };

  const handleOpenDeleteAlert = (item: InventoryItem) => {
    setDeleteAlertState({ open: true, item });
  };

  const handleDialogSubmit = (data: ItemFormData) => {
    if (dialogState.mode === 'add') {
      const newItem: InventoryItem = {
        id: `itm-${Math.random().toString(36).substr(2, 9)}`,
        itemCode: data.itemCode,
        itemName: data.itemName,
        itemGroup: data.itemGroup || ItemGroup.General,
        uoMGroupId: parseInt(data.uoMGroupId),
        barcodeValue: data.barcodeValue,
        remarks: data.remarks,
        lastUpdated: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    } else if (dialogState.mode === 'edit' && dialogState.item) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === dialogState.item!.id
            ? {
                ...i,
                itemName: data.itemName,
                itemGroup: data.itemGroup || i.itemGroup,
                uoMGroupId: parseInt(data.uoMGroupId),
                barcodeValue: data.barcodeValue,
                remarks: data.remarks,
              }
            : i,
        ),
      );
    }
    setDialogState({ ...dialogState, open: false });
  };

  const confirmDelete = () => {
    if (deleteAlertState.item) {
      handleDelete(deleteAlertState.item.id);
      setDeleteAlertState({ open: false, item: null });
    }
  };

  const initialFormData = useMemo(() => {
    if (!dialogState.item) return null;
    return {
      itemCode: dialogState.item.itemCode,
      itemName: dialogState.item.itemName,
      uoMGroupId: dialogState.item.uoMGroupId.toString(),
      itemGroup: dialogState.item.itemGroup,
      barcodeValue: dialogState.item.barcodeValue,
      barcodeFormat: dialogState.item.barcodeFormat,
      remarks: dialogState.item.remarks,
    };
  }, [dialogState.item]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search SKU, name, or location..."
            className="pl-10 h-10 ring-offset-background border-none shadow-sm bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {selectedIds.size} selected
            </span>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2 h-9"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selection
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 h-9"
              onClick={() => console.log('Bulk export...', Array.from(selectedIds))}
            >
              <FileDown className="h-4 w-4" />
              Export Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="px-3 h-9 text-muted-foreground"
              onClick={clearSelection}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="h-9 gap-2">
                <FileUp className="h-4 w-4" />
                <SelectValue placeholder="Import" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">Import CSV</SelectItem>
                <SelectItem value="xlsx">Import Excel</SelectItem>
                <SelectItem value="json">Import JSON</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="gap-2 h-9 shadow-sm" onClick={handleOpenAddDialog}>
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden select-none">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[120px]">Item Code</TableHead>
              <TableHead>Item Details</TableHead>
              <TableHead className="w-[120px]">Group</TableHead>
              <TableHead className="w-[150px]">Barcode</TableHead>
              <TableHead className="w-[200px]">Remarks</TableHead>
              <TableHead className="text-right pr-6 w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow
                key={item.id}
                data-selected={selectedIds.has(item.id)}
                className="data-[selected=true]:bg-primary/5 transition-colors cursor-pointer group"
              >
                <TableCell className="w-[50px]">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(item.id, e.shiftKey);
                    }}
                  >
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => {}} // Controlled by wrapper
                      aria-label={`Select ${item.itemName}`}
                      className="cursor-pointer"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[11px] font-semibold text-muted-foreground">
                  {item.itemCode}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground">{item.itemName}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                    Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium bg-muted/20 border-muted-foreground/10"
                  >
                    {Object.keys(ItemGroup).find(
                      (key) => ItemGroup[key as keyof typeof ItemGroup] === item.itemGroup,
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-mono">{item.barcodeValue || '-'}</div>
                  {item.barcodeFormat && (
                    <div className="text-[10px] text-muted-foreground">
                      {Object.keys(BarcodeFormat).find(
                        (k) =>
                          BarcodeFormat[k as keyof typeof BarcodeFormat] === item.barcodeFormat,
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground line-clamp-2 max-w-[200px]">
                    {item.remarks || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 hover:bg-muted group-hover:opacity-100 opacity-60 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => handleOpenEditDialog(item)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                        Edit Item
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => console.log('Movement', item.id)}
                      >
                        <ArrowRightCircle className="h-4 w-4 text-muted-foreground" />
                        Stock Movement
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => console.log('History', item.id)}
                      >
                        <History className="h-4 w-4 text-muted-foreground" />
                        Operation History
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleOpenDeleteAlert(item)}
                        className="gap-2 text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <p>Showing {filtered.length} items</p>
        <p>Storage Capacity: 65% utilized</p>
      </div>

      <ItemDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
        mode={dialogState.mode}
        initialData={initialFormData}
        onSubmit={handleDialogSubmit}
      />

      <DeleteItemAlertDialog
        open={deleteAlertState.open}
        onOpenChange={(open) => setDeleteAlertState({ ...deleteAlertState, open })}
        itemName={deleteAlertState.item?.itemName || ''}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
