import { useState } from 'react';
import CommonLayout from '@/layouts/CommonLayout';
import { Roles } from '@/features/auth/types/roles';
import { Scanner, ItemDetails, ScanSettings } from '@/features/verification';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type View = 'scanner' | 'details' | 'settings';

export default function VerificationPage() {
  const [view, setView] = useState<View>('scanner');
  const [scannedCode, setScannedCode] = useState('');

  const handleScan = (code: string) => {
    setScannedCode(code);
    setView('details');
  };

  const handleConfirm = () => {
    // After confirmation, redirect back to scanning
    setScannedCode('');
    setView('scanner');
  };

  return (
    <CommonLayout role={Roles.InventoryClerk}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Item Verification</h2>
            <p className="text-sm text-muted-foreground">
              Scan barcodes to verify inventory items.
            </p>
          </div>
          {view !== 'settings' && (
            <Tooltip>
              <TooltipTrigger className="bg-transparent border-none p-0 outline-none">
                <Button variant="ghost" size="icon" onClick={() => setView('settings')}>
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-only">Scanning settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={10} align="end">
                <p>Scanning settings</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="max-w-2xl mx-auto w-full">
          {view === 'scanner' && <Scanner onScan={handleScan} />}
          {view === 'details' && (
            <ItemDetails
              itemCode={scannedCode}
              onConfirm={handleConfirm}
              onBack={() => setView('scanner')}
            />
          )}
          {view === 'settings' && <ScanSettings />}

          {view === 'settings' && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setView('scanner')}>
                Back to Scanner
              </Button>
            </div>
          )}
        </div>
      </div>
    </CommonLayout>
  );
}
