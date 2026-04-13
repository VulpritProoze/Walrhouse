import {
  CheckCircle2,
  MapPin,
  Hash,
  ArrowLeft,
  Calendar,
  Info,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { BatchDto } from '../../types';
import { BatchStatus } from '@/features/batch/types';
import { useCreateVerification } from '../../hooks/mutations/use-verification-mutation';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

type SalesOrderItemDetailsProps = {
  batch?: BatchDto;
  onConfirm?: () => void;
  onConfirmAndRescan?: () => void;
  onBack?: () => void;
};

export default function SalesOrderItemDetails({
  batch,
  onConfirm,
  onConfirmAndRescan,
  onBack,
}: SalesOrderItemDetailsProps) {
  const { mutate: createVerification, isPending } = useCreateVerification();

  if (!batch) return null;

  const handleVerification = (callback?: () => void) => {
    createVerification(
      {
        batchNumber: batch.batchNumber,
        remarks: `SO Verified at ${new Date().toLocaleString()}`,
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
              <Badge
                variant={
                  batch.status === BatchStatus.Released
                    ? 'success'
                    : batch.status === BatchStatus.Locked
                      ? 'destructive'
                      : 'secondary'
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
            <CardDescription>Batch Number: {batch.batchNumber}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Button className="w-full" onClick={() => handleVerification()} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Confirm and Finish Order
          </Button>

          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/5"
            onClick={() => handleVerification(onConfirmAndRescan)}
            disabled={isPending}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm and Scan Next
          </Button>

          <Button variant="ghost" onClick={onBack} disabled={isPending} className="mt-2 w-full">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
