import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Loader2, ArrowLeft } from 'lucide-react';
import type { SalesOrderDto } from '@/features/sales-order/api/sales-order.service';

interface ConfirmFulfillmentProps {
  salesOrder?: SalesOrderDto;
  onFulfill: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmFulfillment({
  salesOrder,
  onFulfill,
  onCancel,
  isLoading,
}: ConfirmFulfillmentProps) {
  const totalOrdered = salesOrder?.orderLines.reduce((acc, ol) => acc + ol.orderedQty, 0) ?? 0;
  const totalPicked = salesOrder?.orderLines.reduce((acc, ol) => acc + (ol.pickedQty ?? 0), 0) ?? 0;

  const isFullyPicked = totalPicked >= totalOrdered && totalOrdered > 0;

  return (
    <Card className="border-none shadow-none text-center sm:border sm:shadow-sm">
      <CardHeader className="pt-10 pb-2">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ClipboardCheck className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Confirm Fulfillment</CardTitle>
        <CardDescription>Review and finalize Sales Order #{salesOrder?.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Picking Progress:</span>
            <span className={`font-bold ${isFullyPicked ? 'text-green-600' : 'text-orange-600'}`}>
              {totalPicked} / {totalOrdered}
            </span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isFullyPicked ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${(totalPicked / totalOrdered) * 100}%` }}
            />
          </div>
          {!isFullyPicked && (
            <p className="text-xs text-orange-600 font-medium">
              Warning: This order is not yet fully picked.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-6">
        <Button className="w-full h-12 text-lg" onClick={onFulfill} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          Confirm & Fulfill Order
        </Button>
        <Button variant="ghost" className="w-full h-12" onClick={onCancel} disabled={isLoading}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scanning
        </Button>
      </CardFooter>
    </Card>
  );
}
