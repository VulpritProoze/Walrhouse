import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Truck, PackageCheck, Home } from 'lucide-react';
import type { SalesOrderDto } from '@/features/sales-order/api/sales-order.service';

interface OrderFulfilledProps {
  salesOrder?: SalesOrderDto;
  onReturnToMenu: () => void;
  onFulfillAnother: () => void;
}

export function OrderFulfilled({
  salesOrder,
  onReturnToMenu,
  onFulfillAnother,
}: OrderFulfilledProps) {
  const totalOrdered = salesOrder?.orderLines.reduce((acc, ol) => acc + ol.orderedQty, 0) ?? 0;
  const totalPicked = salesOrder?.orderLines.reduce((acc, ol) => acc + (ol.pickedQty ?? 0), 0) ?? 0;

  return (
    <Card className="border-none shadow-none text-center sm:border sm:shadow-sm sm:bg-card">
      <CardHeader className="pt-10 pb-2">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-foreground">Order Fulfilled!</CardTitle>
        <CardDescription className="text-lg">
          Sales Order <span className="font-mono font-semibold">#{salesOrder?.id}</span> has been
          successfully verified.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 pb-10">
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 text-left">
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">Ready for Shipment</p>
              <p className="text-xs text-muted-foreground">Status: {salesOrder?.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 text-left">
            <PackageCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">
                {totalPicked}/{totalOrdered} Items Verified
              </p>
              <p className="text-xs text-muted-foreground">All conditions matched.</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-6 border-t">
        <Button className="w-full h-12 text-lg" onClick={onReturnToMenu}>
          <Home className="h-5 w-5 mr-2" />
          Return to Verification Menu
        </Button>
        <Button variant="outline" className="w-full h-12" onClick={onFulfillAnother}>
          Fulfill Another Sales Order
        </Button>
      </CardFooter>
    </Card>
  );
}
