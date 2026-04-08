import { Card } from '@/components/ui/card';
import { PackageDown } from 'lucide-react';

export const ReceivingView = () => {
  return (
    <div className="space-y-6">
      <div className="border border-dashed border-muted rounded-xl p-24 bg-muted/5 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-6 rounded-full bg-white shadow-sm ring-1 ring-muted">
          <PackageDown size={48} className="text-primary/40" strokeWidth={1} />
        </div>
        <div className="space-y-2">
          <h3 className="text-muted-foreground font-semibold text-lg">Receiving View coming soon</h3>
          <p className="text-sm text-muted-foreground/60 max-w-md mx-auto">
            Manage your goods receipts and incoming shipments in this section.
          </p>
        </div>
      </div>
    </div>
  );
};
