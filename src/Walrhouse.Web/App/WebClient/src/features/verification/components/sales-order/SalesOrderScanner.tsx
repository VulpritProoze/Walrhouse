import {
  ScanLine,
  Maximize,
  Minimize,
  Zap,
  ZapOff,
  AlertCircle,
  Loader2,
  Plus,
} from 'lucide-react';
import ScannerDropdownMenu from '../scanner/ScannerDropdownMenu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scanner as QrScanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/utils/logger';
import { ensureAudioContext, playSharpTone } from '../../lib/audio/beeps';
import { useSalesOrder } from '@/features/sales-order/hooks/queries';
import { OrderStatus } from '@/features/sales-order/types';
import type { AxiosError } from 'axios';

type SalesOrderScannerProps = {
  onScan?: (code: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
};

export default function SalesOrderScanner({
  onScan,
  isLoading: parentLoading,
  title = 'Sales Order Verification',
  description = 'Scan a barcode or enter the SO number below',
}: SalesOrderScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [targetSoId, setTargetSoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: salesOrder,
    isLoading: isSoLoading,
    error: fetchError,
  } = useSalesOrder(targetSoId!, !!targetSoId);

  useEffect(() => {
    if (fetchError) {
      const axiosError = fetchError as AxiosError<{ title?: string }>;
      const errorMessage = axiosError.response?.data?.title ?? 'Failed to fetch Sales Order';

      toast.error(errorMessage, { id: 'so-fetch' });
      setError(errorMessage);
      setTargetSoId(null);
    }
  }, [fetchError]);

  useEffect(() => {
    if (isSoLoading && targetSoId) {
      toast.loading('Fetching sales order...', { id: 'so-fetch' });
    }
  }, [isSoLoading, targetSoId]);

  useEffect(() => {
    if (salesOrder) {
      if (salesOrder.status === OrderStatus.Closed) {
        toast.error(`Sales Order #${salesOrder.id} is already Closed.`, { id: 'so-fetch' });
        setError(`Sales Order #${salesOrder.id} is already Closed.`);
        setTargetSoId(null);
      } else if (salesOrder.status === OrderStatus.Cancelled) {
        toast.error(`Sales Order #${salesOrder.id} is Cancelled.`, { id: 'so-fetch' });
        setError(`Sales Order #${salesOrder.id} is Cancelled.`);
        setTargetSoId(null);
      } else {
        toast.success(`Sales Order #${salesOrder.id} loaded.`, { id: 'so-fetch' });
        onScan?.(salesOrder.id.toString());
        setTargetSoId(null);
        setError(null);
      }
    }
  }, [salesOrder, onScan]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        logger.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleTorch = () => {
    setTorchOn((v) => !v);
  };
  const [scannerKey, setScannerKey] = useState(0);
  const [audioBeep, setAudioBeep] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const isLoading = parentLoading || isSoLoading;

  const refreshCamera = () => {
    setScannerKey((k) => k + 1);
  };

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0 && !isLoading) {
      const code = detectedCodes[0].rawValue;
      if (audioBeep) {
        audioCtxRef.current = ensureAudioContext(audioCtxRef.current);
        if (audioCtxRef.current) playSharpTone(audioCtxRef.current, 180, 0.18);
      }

      const id = parseInt(code, 10);
      if (!isNaN(id)) {
        toast.loading('Fetching sales order...', { id: 'so-fetch' });
        setTargetSoId(id);
        setError(null);
      } else {
        setError('Invalid Sales Order ID scanned');
      }
    }
  };

  const handleManualSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (manualCode.trim() && !isLoading) {
      const id = parseInt(manualCode.trim(), 10);
      if (!isNaN(id)) {
        toast.loading('Fetching sales order...', { id: 'so-fetch' });
        setTargetSoId(id);
        setManualCode('');
        setError(null);
      } else {
        setError('Invalid Sales Order ID entered');
      }
    }
  };

  type ExtendedMediaTrackConstraints = MediaTrackConstraints & {
    advanced?: Array<Record<string, unknown>>;
  };

  const scannerConstraints: ExtendedMediaTrackConstraints = {
    facingMode: 'environment',
    advanced: [{ torch: torchOn }],
  };

  return (
    <Card className="w-full overflow-hidden border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <ScanLine className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          ref={containerRef}
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black shadow-inner sm:aspect-square"
        >
          <QrScanner
            key={scannerKey}
            onScan={handleScan}
            onError={(err) => {
              logger.error('Scanner error:', err);
              setError('Could not access camera. Please check permissions.');
            }}
            constraints={scannerConstraints}
            styles={{
              container: { width: '100%', height: '100%' },
              video: { width: '100%', height: '100%', objectFit: 'cover' },
            }}
            components={{
              finder: false,
            }}
            sound={false}
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-[3rem] border-black/40 sm:border-[4rem]" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-primary/50 sm:h-64 sm:w-64">
              <div className="absolute -left-1 -top-1 h-6 w-6 border-l-4 border-t-4 border-primary" />
              <div className="absolute -right-1 -top-1 h-6 w-6 border-r-4 border-t-4 border-primary" />
              <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary" />
              <div className="absolute left-0 top-0 h-0.5 w-full bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-4 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              ALIGN BARCODE WITHIN THE SQUARE
            </div>
          </div>

          <div className="absolute left-4 top-4">
            <ScannerDropdownMenu
              audioBeep={audioBeep}
              setAudioBeep={(v) => setAudioBeep(!!v)}
              refreshCamera={refreshCamera}
            />
          </div>

          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 border-none backdrop-blur-md"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 border-none backdrop-blur-md"
              onClick={toggleTorch}
              title={torchOn ? 'Turn torch off' : 'Turn torch on'}
            >
              {torchOn ? (
                <Zap className="h-5 w-5 text-yellow-300" />
              ) : (
                <ZapOff className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Barcode or ID..."
              className="h-12 pr-10 text-lg font-medium tracking-wider"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12"
            disabled={isLoading || !manualCode.trim()}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
