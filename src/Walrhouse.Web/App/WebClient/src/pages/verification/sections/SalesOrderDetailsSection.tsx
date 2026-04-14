import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import StepProgress from '../components/StepProgress';
import { useSalesOrder } from '@/features/sales-order/hooks/queries';
import { SalesOrderDetails } from '@/features/verification';
import { useVerificationContext } from '@/features/verification/context/use-verification-context';
import { useEffect } from 'react';

const steps = [
  { id: 1, title: 'Scan SO' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Scan Items' },
  { id: 4, title: 'Fulfillment' },
];

export default function SalesOrderDetailsSection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setActiveSalesOrderId } = useVerificationContext();
  const soId = searchParams.get('soHandle');

  const { data: salesOrder, isLoading } = useSalesOrder(Number(soId), !!soId);

  useEffect(() => {
    // Ensure context is synced with the URL state for consistency
    if (salesOrder?.id) {
      setActiveSalesOrderId(salesOrder.id);
    }
  }, [salesOrder?.id, setActiveSalesOrderId]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading Sales Order details...</span>
      </div>
    );
  }

  if (!salesOrder) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-center text-destructive font-medium">Sales Order not found.</p>
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate('/verification/sales-order')}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/verification/sales-order')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Scan Another
        </Button>
      </div>

      <StepProgress steps={steps} currentStep={2} className="mb-8" />

      <SalesOrderDetails
        salesOrder={salesOrder}
        onCancel={() => navigate('/verification/sales-order')}
        onNext={() => navigate(`/verification/scan?isSO=true&soId=${salesOrder.id}`)}
      />
    </div>
  );
}
