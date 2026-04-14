import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Package } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { OrderStatus } from '@/features/sales-order/types';
import { Badge } from '@/components/ui/badge';
import type { SalesOrderDto } from '@/features/verification/types';

interface SalesOrderDetailsProps {
  salesOrder: SalesOrderDto;
  onCancel: () => void;
  onNext: () => void;
}

export default function SalesOrderDetails({
  salesOrder,
  onCancel,
  onNext,
}: SalesOrderDetailsProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <FileCheck className="h-6 w-6 text-primary" />
              Sales Order Details
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Order Number: {salesOrder.id}
            </CardDescription>
          </div>
          <Badge
            variant={
              salesOrder.status === OrderStatus.Open
                ? 'success'
                : salesOrder.status === OrderStatus.Closed
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {salesOrder.status === OrderStatus.Open
              ? 'Open'
              : salesOrder.status === OrderStatus.Closed
                ? 'Closed'
                : 'Cancelled'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Customer</p>
            <p className="font-semibold italic">{salesOrder.customerName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Remarks</p>
            <p className="font-semibold italic leading-snug">
              {salesOrder.remarks || 'No remarks provided.'}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="flex items-center gap-2 font-bold mb-4">
            <Package className="h-4 w-4" />
            Line Items ({salesOrder.orderLines?.length || 0})
          </h4>
          <div className="space-y-2">
            {salesOrder.orderLines?.map((line, idx) => (
              <div
                key={line.docEntry || idx}
                className="flex justify-between items-center rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{line.itemCode}</p>
                    <Badge variant="outline" className="text-[10px] h-4">
                      {line.unitOfMeasure}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {line.docEntry ? `DocEntry: ${line.docEntry}` : 'No DocEntry'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {line.pickedQty ?? 0} / {line.orderedQty}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                    Picked Qty
                  </p>
                </div>
              </div>
            ))}
            {(!salesOrder.orderLines || salesOrder.orderLines.length === 0) && (
              <p className="text-sm text-center text-muted-foreground py-4">No line items found.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={onNext}
          disabled={salesOrder.status !== OrderStatus.Open}
        >
          Next: Start Scan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
