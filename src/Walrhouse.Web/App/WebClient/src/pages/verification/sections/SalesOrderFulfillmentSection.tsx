import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProgress from '../components/StepProgress';
import { useVerificationContext } from '@/features/verification/context/use-verification-context';
import { useSalesOrder } from '@/features/sales-order/hooks/queries';
import { useUpdateSalesOrder } from '@/features/sales-order/hooks/mutations';
import { OrderStatus } from '@/features/sales-order/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmFulfillment } from '@/features/verification/components/fulfillment/ConfirmFulfillment';
import { OrderFulfilled } from '@/features/verification/components/fulfillment/OrderFulfilled';

const steps = [
  { id: 1, title: 'Scan SO' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Scan Items' },
  { id: 4, title: 'Fulfillment' },
];

export default function SalesOrderFulfillmentSection() {
  const navigate = useNavigate();
  const { activeSalesOrderId } = useVerificationContext();
  const { data: salesOrder, isLoading: isSoLoading } = useSalesOrder(
    activeSalesOrderId!,
    !!activeSalesOrderId,
  );
  const { mutate: updateSalesOrder, isPending: isUpdatePending } = useUpdateSalesOrder();

  const [isFulfilled, setIsFulfilled] = useState(salesOrder?.status === OrderStatus.Closed);

  const handleFulfillConfirm = () => {
    if (!salesOrder) return;

    updateSalesOrder(
      {
        id: salesOrder.id,
        data: {
          ...salesOrder,
          status: OrderStatus.Closed,
        },
      },
      {
        onSuccess: () => {
          toast.success('Sales Order fulfilled successfully!');
          setIsFulfilled(true);
        },
        onError: () => {
          toast.error('Failed to fulfill the Sales Order.');
        },
      },
    );
  };

  if (isSoLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Reloading order data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepProgress steps={steps} currentStep={4} className="mb-8" />

      {isFulfilled ? (
        <OrderFulfilled
          salesOrder={salesOrder}
          onReturnToMenu={() => navigate('/verification')}
          onFulfillAnother={() => navigate('/verification/sales-order')}
        />
      ) : (
        <ConfirmFulfillment
          salesOrder={salesOrder}
          onFulfill={handleFulfillConfirm}
          onCancel={() => navigate('/verification/scan?isSO=true')}
          isLoading={isUpdatePending}
        />
      )}
    </div>
  );
}
