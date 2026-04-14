import { useNavigate, useSearchParams } from 'react-router-dom';
import { Scanner, BatchScanner } from '@/features/verification';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import StepProgress from '../components/StepProgress';

const steps = [
  { id: 1, title: 'Scan SO' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Scan Items' },
  { id: 4, title: 'Fulfillment' },
];

export default function ScannerSection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSO = searchParams.get('isSO') === 'true';

  const handleScan = (code: string) => {
    const url = isSO
      ? `/verification/details?code=${code}&isSO=true`
      : `/verification/details?code=${code}`;
    navigate(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(isSO ? '/verification/sales-order/details' : '/verification')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {isSO && <StepProgress steps={steps} currentStep={3} className="mb-8" />}

      {isSO ? (
        <BatchScanner
          onScan={handleScan}
          title="Item Verification"
          description="Scan the items for this Sales Order"
        />
      ) : (
        <Scanner onScan={handleScan} />
      )}
    </div>
  );
}
