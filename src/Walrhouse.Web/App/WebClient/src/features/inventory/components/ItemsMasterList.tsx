import { useState } from 'react';
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
  Box,
  LayoutGrid,
  ArrowRightCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

// ─── Types ──────────────────────────────────────────────────────────────────
export type ItemStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  unit: string;
  binLocation: string;
  status: ItemStatus;
  lastUpdated: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ITEMS: InventoryItem[] = [
  {
    id: 'itm-001',
    sku: 'SKU-WAL-001',
    name: 'Industrial Pallet Rack',
    category: 'Storage',
    stockLevel: 45,
    unit: 'Units',
    binLocation: 'A1-B2-01',
    status: 'in-stock',
    lastUpdated: '2026-03-29T09:12:00Z',
  },
  {
    id: 'itm-002',
    sku: 'SKU-WAL-002',
    name: 'Heavy Duty Crate',
    category: 'Handling',
    stockLevel: 12,
    unit: 'Units',
    binLocation: 'B4-C1-05',
    status: 'low-stock',
    lastUpdated: '2026-03-28T14:30:00Z',
  },
  {
    id: 'itm-003',
    sku: 'SKU-WAL-003',
    name: 'Standard Box (Small)',
    category: 'Packaging',
    stockLevel: 120,
    unit: 'Packs',
    binLocation: 'A2-D5-12',
    status: 'low-stock',
    lastUpdated: '2026-03-27T11:00:00Z',
  },
  {
    id: 'itm-004',
    sku: 'SKU-WAL-004',
    name: 'Stretch Wrap Roll',
    category: 'Consumables',
    stockLevel: 0,
    unit: 'Rolls',
    binLocation: 'C1-A2-03',
    status: 'out-of-stock',
    lastUpdated: '2026-03-10T09:00:00Z',
  },
  {
    id: 'itm-005',
    sku: 'SKU-WAL-005',
    name: 'Safety Vest (L)',
    category: 'Safety',
    stockLevel: 25,
    unit: 'Units',
    binLocation: 'Z9-O2-01',
    status: 'discontinued',
    lastUpdated: '2026-02-15T08:00:00Z',
  },
];

const STATUS_VARIANT: Record<ItemStatus, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'destructive',
  discontinued: 'secondary',
};

// ─── Main component ───────────────────────────────────────────────────────────
export const ItemsMasterList = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const filtered = items.filter((item) =>
    `${item.sku} ${item.name} ${item.category} ${item.binLocation}`.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
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
              onClick={() => console.log("Bulk export...", Array.from(selectedIds))}
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
            <Button size="sm" className="gap-2 h-9 shadow-sm" onClick={() => console.log("Add Item")}>
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
              <TableHead className="w-[120px]">SKU</TableHead>
              <TableHead>Item Details</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[100px] text-center">Stock</TableHead>
              <TableHead className="w-[120px]">Bin Location</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-right pr-6 w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-20">
                  <div className="flex flex-col items-center gap-2">
                    <Box size={40} className="text-muted-foreground/20" strokeWidth={1} />
                    <p>No storage items found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((item) => (
              <TableRow
                key={item.id}
                data-selected={selectedIds.has(item.id)}
                className="data-[selected=true]:bg-primary/5 transition-colors cursor-pointer group"
                onClick={(e) => {
                  // We handle toggle logic in TableRow to make it easier to click anywhere
                  // unless clicking on buttons/menus/checkbox itself which we handle via stopPropagation if needed
                  // But following UserManagement example, let's stick to checkbox only or explicit toggle
                }}
              >
                <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                  <div
                    onClick={(e) => {
                      toggleSelection(item.id, e.shiftKey);
                    }}
                  >
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => {}} // Controlled by wrapper
                      aria-label={`Select ${item.name}`}
                      className="cursor-pointer"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[11px] font-semibold text-muted-foreground">
                  {item.sku}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                     Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-medium bg-muted/20 border-muted-foreground/10">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                   <div className="font-mono font-bold text-sm">
                     {item.stockLevel}
                   </div>
                   <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.unit}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-medium decoration-primary/30 underline-offset-4 hover:underline">
                    <LayoutGrid size={12} className="text-muted-foreground" />
                    {item.binLocation}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[item.status]} className="capitalize text-[10px] font-bold">
                    {item.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 hover:bg-muted group-hover:opacity-100 opacity-60 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="gap-2" onClick={() => console.log('Edit', item.id)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                        Edit Item
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => console.log('Movement', item.id)}>
                        <ArrowRightCircle className="h-4 w-4 text-muted-foreground" />
                        Stock Movement
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => console.log('History', item.id)}>
                        <History className="h-4 w-4 text-muted-foreground" />
                        Operation History
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id)}
                        className="gap-2 text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Permanently
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
    </div>
  );
};
