import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, FileCheck, Package } from 'lucide-react';
import StepProgress from '../components/StepProgress';

const steps = [
  { id: 1, title: 'Scan SO' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Scan Items' },
  { id: 4, title: 'Fulfillment' },
];

export default function SalesOrderDetailsSection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const soHandle = searchParams.get('soHandle') ?? 'SO-2025-001';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/verification/sales-order')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Scan Another
        </Button>
      </div>

      <StepProgress steps={steps} currentStep={2} className="mb-8" />

      <Card>
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <FileCheck className="h-6 w-6 text-primary" />
                Sales Order Details
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                Order Number: {soHandle}
              </CardDescription>
            </div>
            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Verified
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Customer</p>
              <p className="font-semibold italic">Acme Corporation</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
              <p className="font-semibold italic">April 13, 2026</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Ship Date</p>
              <p className="font-semibold italic">April 20, 2026</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Warehouse</p>
              <p className="font-semibold italic">Main Distribution Center</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="flex items-center gap-2 font-bold mb-4">
              <Package className="h-4 w-4" />
              Line Items
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center rounded-lg border p-3">
                <div>
                  <p className="font-medium">Item: WL-WID-991</p>
                  <p className="text-sm text-muted-foreground">Super Mega Widget A-1000</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl">
                    15 <span className="text-sm text-muted-foreground">/ 15</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center rounded-lg border p-3">
                <div>
                  <p className="font-medium">Item: WL-SP-002</p>
                  <p className="text-sm text-muted-foreground">Standard Power Cable 2m</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl">
                    10 <span className="text-sm text-muted-foreground">/ 10</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
          <Button variant="outline" className="flex-1 opacity-50 cursor-not-allowed">
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => navigate('/verification/scan?isSO=true')}>
            Next: Start Scan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
