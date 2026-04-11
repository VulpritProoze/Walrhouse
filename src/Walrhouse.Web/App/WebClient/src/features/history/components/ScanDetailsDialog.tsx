import { ClipboardList, Hash, MapPin, Calendar, User, Info, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBatch } from '@/features/batch/hooks/queries/use-batch';
import { useItem } from '@/features/item/hooks/queries/use-item';
import { BatchStatus } from '@/features/batch/types';
import { type VerificationHistoryDto } from '../types';
import { cn } from '@/lib/utils';

interface ScanDetailsDialogProps {
  scan: VerificationHistoryDto | null;
  onOpenChange: (open: boolean) => void;
}

export function ScanDetailsDialog({ scan, onOpenChange }: ScanDetailsDialogProps) {
  const { data: batch, isLoading: isBatchLoading } = useBatch(
    scan?.batchNumberVerified ?? '',
    !!scan?.batchNumberVerified,
  );

  const { data: item, isLoading: isItemLoading } = useItem(
    batch?.itemCode ?? '',
    !!batch?.itemCode,
  );

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const isLoading = isBatchLoading || isItemLoading;

  return (
    <Dialog open={!!scan} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Verification Report
          </DialogTitle>
          <DialogDescription>Details for Batch: {scan?.batchNumberVerified}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Retrieving batch and item details...</p>
          </div>
        ) : (
          scan && (
            <div className="space-y-6 py-4">
              {/* Batch & Item Summary */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">{item?.itemName || 'Item Name N/A'}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" />
                    {item?.itemCode || batch?.itemCode}
                  </p>
                </div>
                {batch && (
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
                )}
              </div>

              <Separator />

              {/* Grid 1: Logistics info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Bin Location
                  </p>
                  <p className="text-sm font-mono">{batch?.binNo || 'Unassigned'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Expiration
                  </p>
                  <p
                    className={cn(
                      'text-sm font-medium',
                      batch?.expiryDate && isExpired(batch.expiryDate) ? 'text-destructive' : '',
                    )}
                  >
                    {batch?.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </p>
                  <p className="text-sm">{item?.category || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Units per Box
                  </p>
                  <p className="text-sm">{item?.qtyPerBox || 'N/A'}</p>
                </div>
              </div>

              <Separator />

              {/* Grid 2: Audit info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-muted/30 p-3 rounded-lg">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Verified By
                  </p>
                  <p className="text-sm">{scan.createdBy}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Scan Date
                  </p>
                  <p className="text-sm">{new Date(scan.createdAt).toLocaleString()}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" /> Remarks
                  </p>
                  <p className="text-sm italic text-muted-foreground">
                    {scan.remarks || 'No remarks provided.'}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
