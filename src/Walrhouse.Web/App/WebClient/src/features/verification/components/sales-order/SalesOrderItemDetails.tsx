import {
  CheckCircle2,
  MapPin,
  Hash,
  ArrowLeft,
  Calendar,
  Info,
  Loader2,
  Package,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { BatchDto } from '../../types';
import { BatchStatus } from '@/features/batch/types';
import { useCreateVerification } from '../../hooks/mutations/use-verification-mutation';
import { useSalesOrder } from '@/features/sales-order/hooks/queries';
import { useUpdateSalesOrder } from '@/features/sales-order/hooks/mutations';
import { OrderStatus } from '@/features/sales-order/types';
import { useItem } from '@/features/item/hooks/queries/use-item';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

type SalesOrderItemDetailsProps = {
  batch?: BatchDto;
  salesOrderId?: number;
  onConfirm?: () => void;
  onConfirmAndRescan?: () => void;
  onBack?: () => void;
};

export default function SalesOrderItemDetails({
  batch,
  salesOrderId,
  onConfirm,
  onConfirmAndRescan,
  onBack,
}: SalesOrderItemDetailsProps) {
  const { mutate: createVerification, isPending: isVerificationPending } = useCreateVerification();
  const { mutate: updateSalesOrder, isPending: isUpdatePending } = useUpdateSalesOrder();

  const { data: salesOrder, isLoading: isSoLoading } = useSalesOrder(salesOrderId!, !!salesOrderId);
  const { data: item, isLoading: isItemLoading } = useItem(
    batch?.itemCode ?? '',
    !!batch?.itemCode,
  );

  if (!batch) return null;

  const handleVerification = (shouldFulfill: boolean = false) => {
    if (!salesOrder) {
      toast.error('Sales order data not loaded');
      return;
    }

    if (salesOrder.status === OrderStatus.Closed) {
      toast.error('This Sales Order is already Closed');
      return;
    }

    if (salesOrder.status === OrderStatus.Cancelled) {
      toast.error('This Sales Order has been Cancelled');
      return;
    }

    const orderLine = salesOrder.orderLines.find((ol) => ol.itemCode === batch.itemCode);

    if (!orderLine) {
      toast.error(`Item ${batch.itemCode} is not in this Sales Order`);
      return;
    }

    const currentPicked = orderLine.pickedQty ?? 0;
    const currentOrdered = orderLine.orderedQty ?? 0;

    if (currentPicked >= currentOrdered) {
      toast.error('Item is already fully picked for this order');
      return;
    }

    createVerification(
      {
        batchNumber: batch.batchNumber,
        remarks: `Verified for SO #${salesOrder.id} at ${new Date().toLocaleString()}`,
      },
      {
        onSuccess: () => {
          // Now update the SO pick qty
          const updatedLines = salesOrder.orderLines.map((ol) =>
            ol.itemCode === batch.itemCode ? { ...ol, pickedQty: (ol.pickedQty ?? 0) + 1 } : ol,
          );

          updateSalesOrder(
            {
              id: salesOrder.id,
              data: {
                ...salesOrder,
                status: shouldFulfill ? OrderStatus.Closed : salesOrder.status,
                orderLines: updatedLines,
              },
            },
            {
              onSuccess: () => {
                toast.success(
                  shouldFulfill ? 'Item verified and Order Fulfilled' : 'Item verified and added',
                );
                if (shouldFulfill) {
                  onConfirm?.();
                } else {
                  onConfirmAndRescan?.();
                }
              },
              onError: (error) => {
                const axiosError = error as AxiosError<{ title?: string }>;
                toast.error(axiosError.response?.data?.title ?? 'Failed to update Sales Order');
              },
            },
          );
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ title?: string }>;
          toast.error(axiosError.response?.data?.title ?? 'Failed to verify batch');
        },
      },
    );
  };

  const isTerminalState =
    salesOrder?.status === OrderStatus.Closed || salesOrder?.status === OrderStatus.Cancelled;

  const isLoading = isVerificationPending || isSoLoading || isItemLoading || isUpdatePending;

  const orderLine = salesOrder?.orderLines.find((ol) => ol.itemCode === batch.itemCode);
  const pickedQty = orderLine?.pickedQty ?? 0;
  const orderedQty = orderLine?.orderedQty ?? 0;
  const isFullyPicked = pickedQty >= orderedQty && orderedQty > 0;

  // Check if the entire order is ready for fulfillment
  const totalOrdered = salesOrder?.orderLines.reduce((sum, ol) => sum + ol.orderedQty, 0) ?? 0;
  const totalPicked = salesOrder?.orderLines.reduce((sum, ol) => sum + (ol.pickedQty ?? 0), 0) ?? 0;
  const isOrderReady = totalPicked >= totalOrdered && totalOrdered > 0;

  return (
    <div className="space-y-6">
      {/* ... previous code ... */}
      <Card className="w-full border-primary/20 shadow-md">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Sales Order #{salesOrderId}
                  </CardTitle>
                </div>
                {salesOrder && (
                  <Badge variant={isTerminalState ? 'destructive' : 'outline'}>
                    {salesOrder.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Customer
              </p>
              <p className="font-medium truncate">{salesOrder?.customerName || 'N/A'}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-muted-foreground flex items-center gap-1.5 justify-end">
                <Calendar className="h-3.5 w-3.5" /> Due Date
              </p>
              <p className="font-medium">
                {salesOrder?.dueDate ? new Date(salesOrder.dueDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-secondary">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${isFullyPicked ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}
              >
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Scanned Item Progress
                </p>
                <p className="text-2xl font-bold">
                  {pickedQty}{' '}
                  <span className="text-sm font-normal text-muted-foreground">/ {orderedQty}</span>
                </p>
              </div>
            </div>
            {isFullyPicked && (
              <Badge className="bg-green-600 hover:bg-green-700">Fully Picked</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Batch & Item Info
              </CardTitle>
              <CardDescription>Details for batch {batch.batchNumber}</CardDescription>
            </div>
            <Badge variant={batch.status === BatchStatus.Released ? 'outline' : 'secondary'}>
              {batch.status || 'Unknown Status'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Item Information
                </label>
                <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Code:</span>
                    <span className="text-sm font-bold">{batch.itemCode}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm text-muted-foreground shrink-0">Name:</span>
                    <span className="text-sm font-medium text-right">
                      {item?.itemName || 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Expiry Date</span>
                </div>
                <p className="font-semibold px-1">
                  {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'No expiry'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Current Bin Location</span>
                </div>
                <p className="font-semibold px-1">{batch.binNo || 'Unassigned'}</p>
              </div>

              {batch.status !== BatchStatus.Released && (
                <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-800 border border-orange-200">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>Batch is {batch.status}. It can be verified but check status first.</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1 py-6 text-lg"
                disabled={isLoading || isTerminalState}
                onClick={() => handleVerification(true)}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                )}
                Verify & Proceed to Fulfill
              </Button>
              <Button
                variant="outline"
                className="flex-1 py-6 text-lg border-2"
                disabled={isLoading || isTerminalState}
                onClick={() => handleVerification(false)}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Verify & Scan Next
              </Button>
            </div>

            {isOrderReady && !isTerminalState && (
              <Button
                variant="secondary"
                className="w-full py-6 text-lg border-2 border-dashed border-primary/20 hover:border-primary/50"
                onClick={onConfirm}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Skip to Fulfillment (All Items Picked)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
