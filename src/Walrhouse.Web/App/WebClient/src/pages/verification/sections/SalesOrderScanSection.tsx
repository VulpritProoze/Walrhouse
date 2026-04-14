import { useNavigate } from 'react-router-dom';
import { SalesOrderScanner } from '@/features/verification';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepProgress from '../components/StepProgress';
import { useVerificationContext } from '@/features/verification/context/use-verification-context';

const steps = [
  { id: 1, title: 'Scan SO' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Scan Items' },
  { id: 4, title: 'Fulfillment' },
];

export default function SalesOrderScanSection() {
  const navigate = useNavigate();
  const { setActiveSalesOrderId } = useVerificationContext();

  const handleScan = (code: string) => {
    // Set the active SO ID in context
    const soId = Number(code);
    if (!isNaN(soId)) {
      setActiveSalesOrderId(soId);
    }
    // Navigate to details page with the SO barcode
    navigate(`/verification/sales-order/details?soHandle=${code}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/verification')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <StepProgress steps={steps} currentStep={1} className="mb-8" />

      <Card className="border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            Scan Sales Order
          </CardTitle>
          <CardDescription>Scan the barcode on the Sales Order document to begin.</CardDescription>
        </CardHeader>
      </Card>

      <SalesOrderScanner
        onScan={handleScan}
        title="SO Scanner"
        description="Align the Sales Order barcode within the square"
      />
    </div>
  );
}
