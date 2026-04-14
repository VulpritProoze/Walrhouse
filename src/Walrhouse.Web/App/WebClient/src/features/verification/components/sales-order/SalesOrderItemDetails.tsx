import {
  CheckCircle2,
  MapPin,
  Hash,
  ArrowLeft,
  Calendar,
  Info,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { BatchDto } from '../../types';
import { BatchStatus } from '@/features/batch/types';
import { useCreateVerification } from '../../hooks/mutations/use-verification-mutation';
import { useSalesOrder } from '@/features/sales-order/hooks/queries';
import { OrderStatus } from '@/features/sales-order/types';
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

  const { data: salesOrder, isLoading: isSoLoading } = useSalesOrder(salesOrderId!, !!salesOrderId);

  if (!batch) return null;

  const handleVerification = (callback?: () => void) => {
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

    createVerification(
      {
        batchNumber: batch.batchNumber,
        remarks: `Verified for SO #${salesOrder.id} at ${new Date().toLocaleString()}`,
      },
      {
        onSuccess: () => {
          toast.success('Item verified for Sales Order');
          if (callback) {
            callback();
          } else {
            onConfirm?.();
          }
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

  const isLoading = isVerificationPending || isSoLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Item Verification (SO Mode)</CardTitle>
              <div className="flex gap-2">
                {salesOrder && (
                  <Badge variant={isTerminalState ? 'destructive' : 'outline'}>
                    SO #{salesOrder.id}:{' '}
                    {salesOrder.status === OrderStatus.Open
                      ? 'Open'
                      : salesOrder.status === OrderStatus.Closed
                        ? 'Closed'
                        : 'Cancelled'}
                  </Badge>
                )}
                <Badge
                  variant={
                    batch.status === BatchStatus.Released
                      ? 'outline'
                      : batch.status === BatchStatus.Locked
                        ? 'destructive'
                        : 'secondary'
                  }
                  className={
                    batch.status === BatchStatus.Released ? 'border-green-500 text-green-500' : ''
                  }
                >
                  {batch.status === BatchStatus.Released
                    ? 'Released'
                    : batch.status === BatchStatus.Locked
                      ? 'Locked'
                      : batch.status === BatchStatus.Restricted
                        ? 'Restricted'
                        : 'Unknown'}
                </Badge>
              </div>
            </div>
            <CardDescription className="flex items-center gap-2">
              <span className="font-semibold text-primary">Batch: {batch.batchNumber}</span>
              <span className="text-muted-foreground">•</span>
              <span>{batch.itemCode}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isTerminalState && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-destructive">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Action Required</p>
              <p>
                This Sales Order is{' '}
                {salesOrder?.status === OrderStatus.Closed ? 'Closed' : 'Cancelled'}. You cannot
                verify items against it.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Item Code</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              {batch.itemCode}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Bin Location</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {batch.binNo || 'Unassigned'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Expiry Date</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              {batch.status === BatchStatus.Released
                ? 'Released'
                : batch.status === BatchStatus.Locked
                  ? 'Locked'
                  : batch.status === BatchStatus.Restricted
                    ? 'Restricted'
                    : 'Unknown'}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          {!isTerminalState ? (
            <>
              <Button className="w-full" onClick={() => handleVerification()} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Confirm and Finish
              </Button>

              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5 shadow-sm"
                onClick={() => handleVerification(onConfirmAndRescan)}
                disabled={isLoading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Pick and Scan Next
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full" onClick={onBack}>
              Go Back
            </Button>
          )}

          <Button variant="ghost" onClick={onBack} disabled={isLoading} className="mt-2 w-full">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
