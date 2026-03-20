import { ClipboardList } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Scan } from '../types';

interface ScanDetailsDialogProps {
  scan: Scan | null;
  onOpenChange: (open: boolean) => void;
}

export function ScanDetailsDialog({ scan, onOpenChange }: ScanDetailsDialogProps) {
  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <Dialog open={!!scan} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Scan Details
          </DialogTitle>
          <DialogDescription>
            Detailed verification report for SKU: {scan?.sku}
          </DialogDescription>
        </DialogHeader>
        {scan && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Product Name
                </p>
                <p className="text-sm font-semibold">{scan.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    isExpired(scan.expirationDate)
                      ? 'destructive'
                      : scan.status === 'Verified'
                        ? 'success'
                        : 'warning'
                  }
                >
                  {isExpired(scan.expirationDate) ? 'Expired' : scan.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Bin Location
                </p>
                <p className="font-mono text-sm">{scan.binLocation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  UOM / Qty per Box
                </p>
                <p className="text-sm">
                  {scan.uom} / {scan.qtyPerBox} per box
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Item Box Dimensions (cm)
                </p>
                <p className="text-sm font-mono">
                  {scan.itemDimensions.length}L x {scan.itemDimensions.width}W x {scan.itemDimensions.height}H
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Bin Dimensions (cm)
                </p>
                <p className="text-sm font-mono">
                  {scan.binDimensions.length}L x {scan.binDimensions.width}W x {scan.binDimensions.height}H
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Scan Date / Time
                </p>
                <p className="text-sm">{scan.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Expiration Date
                </p>
                <p
                  className={`text-sm font-medium ${
                    isExpired(scan.expirationDate) ? 'text-destructive' : ''
                  }`}
                >
                  {scan.expirationDate}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Verified By
                </p>
                <p className="text-sm">{scan.scannedBy}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
