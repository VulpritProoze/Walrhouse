import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBatch } from '@/features/batch/hooks/queries/use-batch';
import { decodeBatchBarcode } from '@/features/batch/util/barcode';
import { ItemDetails, SalesOrderItemDetails } from '@/features/verification';
import { Spinner } from '@/components/ui/spinner';
import { useVerificationContext } from '@/features/verification/context/use-verification-context';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepProgress from '../components/StepProgress';

const steps = [
  { id: 1, title: 'Scan SO' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Scan Items' },
  { id: 4, title: 'Fulfillment' },
];

export default function DetailsSection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeSalesOrderId } = useVerificationContext();
  const code = searchParams.get('code');
  const isSO = searchParams.get('isSO') === 'true';

  const decodedBatchNum = decodeBatchBarcode(code ?? '');
  const { data: batch, isLoading, isError } = useBatch(decodedBatchNum, !!decodedBatchNum);

  const handleBack = () => {
    navigate(isSO ? '/verification/scan?isSO=true' : '/verification/scan');
  };

  const handleConfirm = () => {
    navigate(isSO ? '/verification/sales-order/fulfillment' : '/verification');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {isSO && <StepProgress steps={steps} currentStep={3} className="mb-4" />}
        <div className="flex h-64 items-center justify-center">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !batch) {
    return (
      <div className="flex flex-col gap-6">
        {isSO && <StepProgress steps={steps} currentStep={3} className="mb-4" />}
        <Empty className="border-dashed">
          <EmptyMedia>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Batch Not Found</EmptyTitle>
            <EmptyDescription>
              We couldn't find a batch with the code "{code}". Please try scanning again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleBack}>Back to Scanner</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (isSO) {
    return (
      <div className="flex flex-col gap-6">
        <StepProgress steps={steps} currentStep={3} className="mb-4" />
        <SalesOrderItemDetails
          batch={batch}
          salesOrderId={activeSalesOrderId ?? undefined}
          onBack={handleBack}
          onConfirm={handleConfirm}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ItemDetails batch={batch} onBack={handleBack} onConfirm={handleConfirm} />
    </div>
  );
}
