import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import {
  type IncomingOrderDto,
  IncomingOrderStatus as OrderStatus,
} from '../../types/incoming-order-dto';
import {
  type CreateSalesOrderRequest,
  type UpdateSalesOrderRequest,
} from '@/features/sales-order/api/sales-order.service';
import { AddIncomingOrderDialog, EditIncomingOrderDialog } from './IncomingOrdersDialogs';
import { useSalesOrders } from '@/features/sales-order/hooks/queries';
import {
  useCreateSalesOrder,
  useUpdateSalesOrder,
  useDeleteSalesOrder,
} from '@/features/sales-order/hooks/mutations';
import { toast } from 'sonner';

export const IncomingOrdersView = () => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<IncomingOrderDto | null>(null);

  const { data, isLoading } = useSalesOrders({ pageNumber: 1, pageSize: 100 });
  const createMutation = useCreateSalesOrder();
  const updateMutation = useUpdateSalesOrder();
  const deleteMutation = useDeleteSalesOrder();

  const orders = data?.items || [];

  const handleCreate = async (dto: CreateSalesOrderRequest) => {
    await createMutation.mutateAsync({
      customerName: dto.customerName,
      dueDate: dto.dueDate,
      remarks: dto.remarks,
      orderLines: (dto.orderLines ?? []).map((l) => ({
        itemCode: l.itemCode,
        unitOfMeasure: l.unitOfMeasure,
        orderedQty: l.orderedQty,
      })),
    });
  };

  const handleUpdate = async (dto: UpdateSalesOrderRequest) => {
    await updateMutation.mutateAsync({
      id: dto.id,
      data: {
        id: dto.id,
        customerName: dto.customerName,
        dueDate: dto.dueDate,
        remarks: dto.remarks,
        status: dto.status ?? undefined,
        orderLines: (dto.orderLines ?? []).map((l) => ({
          itemCode: l.itemCode,
          unitOfMeasure: l.unitOfMeasure,
          orderedQty: l.orderedQty,
          pickedQty: l.pickedQty,
          docEntry: l.docEntry,
        })),
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Order deleted');
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const getStatusBadge = (order: IncomingOrderDto) => {
    switch (order.status) {
      case OrderStatus.Open:
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Open
          </Badge>
        );
      case OrderStatus.Closed:
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            {order.closedBy ? `Closed by ${order.closedBy}` : 'Closed'}
          </Badge>
        );
      case OrderStatus.Cancelled:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer or order ID..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Order
        </Button>
      </div>

      <div className="border rounded-md bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lines</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No incoming orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell>
                    {order.dueDate ? format(parseISO(order.dueDate), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(order)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {order.orderLines?.length || 0} lines
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingOrder(order)}>
                          <Edit2 className="h-4 w-4 mr-2" />{' '}
                          {order.status === OrderStatus.Closed ? 'View' : 'Edit'}
                        </DropdownMenuItem>
                        {order.status !== OrderStatus.Closed && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddIncomingOrderDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSave={handleCreate} />

      <EditIncomingOrderDialog
        order={editingOrder}
        open={!!editingOrder}
        onOpenChange={(open) => !open && setEditingOrder(null)}
        onSave={handleUpdate}
      />
    </div>
  );
};
