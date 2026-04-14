import { Zap, ZapOff, Maximize, Minimize, ScanLine, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scanner as QrScanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useState, useRef, useEffect } from 'react';
import { logger } from '@/lib/utils/logger';
import { ensureAudioContext, playSharpTone } from '../../lib/audio/beeps';

type BatchScannerProps = {
  onScan?: (code: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
};

export default function BatchScanner({
  onScan,
  isLoading,
  title = 'Batch Verification',
  description = 'Scan a batch barcode or enter the batch number below',
}: BatchScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scannerKey] = useState(0);
  const [audioBeep] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

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

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0 && !isLoading) {
      const code = detectedCodes[0].rawValue;
      if (audioBeep) {
        audioCtxRef.current = ensureAudioContext(audioCtxRef.current);
        if (audioCtxRef.current) playSharpTone(audioCtxRef.current, 180, 0.18);
      }
      onScan?.(code);
      setError(null);
    }
  };

  const handleManualSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (manualCode.trim() && !isLoading) {
      onScan?.(manualCode.trim());
      setManualCode('');
      setError(null);
    }
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
          {isLoading && <div className="h-2 w-2 animate-ping rounded-full bg-primary" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div
          ref={containerRef}
          className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-xl bg-black shadow-2xl transition-all duration-300 ring-1 ring-white/10"
        >
          <div className="absolute inset-0 z-10">
            <div className="absolute top-0 left-0 right-0 h-1/4 bg-black/40 backdrop-blur-[2px]" />
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-black/40 backdrop-blur-[2px]" />
            <div className="absolute top-1/4 bottom-1/4 left-0 w-1/4 bg-black/40 backdrop-blur-[2px]" />
            <div className="absolute top-1/4 bottom-1/4 right-0 w-1/4 bg-black/40 backdrop-blur-[2px]" />

            <div className="absolute top-1/4 bottom-1/4 left-1/4 right-1/4 border-2 border-primary/50 rounded-lg shadow-[0_0_0_2px_rgba(var(--primary),0.2)]">
              <div className="absolute -top-1 -left-1 h-6 w-6 border-t-4 border-l-4 border-primary rounded-tl-md" />
              <div className="absolute -top-1 -right-1 h-6 w-6 border-t-4 border-r-4 border-primary rounded-tr-md" />
              <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary rounded-bl-md" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary rounded-br-md" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-primary/40 animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
            <Button
              size="icon"
              variant="secondary"
              className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 shadow-xl"
              onClick={() => setTorchOn(!torchOn)}
            >
              {torchOn ? <ZapOff className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 shadow-xl"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>

          <QrScanner
            key={scannerKey}
            onScan={handleScan}
            paused={isLoading}
            styles={{ container: { height: '100%', width: '100%' } }}
            components={{
              torch: torchOn,
              finder: false,
            }}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="flex flex-col gap-2 pt-2">
          <div className="relative group">
            <Input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Or enter batch number manually..."
              className="pr-16 h-12 text-base transition-all group-focus-within:ring-2"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1.5 top-1.5 h-9"
              disabled={!manualCode.trim() || isLoading}
            >
              Submit
            </Button>
          </div>
          <p className="text-[11px] text-center text-muted-foreground uppercase tracking-widest font-semibold opacity-70">
            Manual Entry for testing
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

