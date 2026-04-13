import { useNavigate } from 'react-router-dom';
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
import StepProgress from '../components/StepProgress';

const steps = [
  { id: 1, title: 'Scan SO' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Scan Items' },
  { id: 4, title: 'Fulfillment' },
];

export default function SalesOrderFulfillmentSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <StepProgress steps={steps} currentStep={4} className="mb-8" />

      <Card className="border-none shadow-none text-center sm:border sm:shadow-sm sm:bg-card">
        <CardHeader className="pt-10 pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Order Fulfilled!</CardTitle>
          <CardDescription className="text-lg">
            Sales Order <span className="font-mono font-semibold">SO-2025-001</span> has been
            successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 pb-10">
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 text-left">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-semibold">Ready for Shipment</p>
                <p className="text-xs text-muted-foreground">Assigned to: Delivery Route #42</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 text-left">
              <PackageCheck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-semibold">25/25 Items Verified</p>
                <p className="text-xs text-muted-foreground">All conditions matched.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pt-6 border-t">
          <Button className="w-full h-12 text-lg" onClick={() => navigate('/verification')}>
            <Home className="h-5 w-5 mr-2" />
            Return to Verification Menu
          </Button>
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => navigate('/verification/sales-order')}
          >
            Fulfill Another Sales Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
