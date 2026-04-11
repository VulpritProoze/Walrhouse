import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBatch } from '@/features/batch/hooks/queries/use-batch';
import { ItemDetails } from '@/features/verification';
import { Spinner } from '@/components/ui/spinner';
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

export default function DetailsSection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');

  const { data: batch, isLoading, isError } = useBatch(code ?? '', !!code);

  const handleBack = () => {
    navigate('/verification');
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (isError || !batch) {
    return (
      <Empty className="border-dashed">
        <EmptyMedia>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Item Not Found</EmptyTitle>
          <EmptyDescription>
            We couldn't find an item with the code "{code}". Please try scanning again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={handleBack}>Back to Scanner</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return <ItemDetails batch={batch} onBack={handleBack} onConfirm={handleBack} />;
}
