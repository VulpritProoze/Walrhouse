import { ScanLine, Maximize, Minimize, Zap, ZapOff, AlertCircle } from 'lucide-react';
import ScannerDropdownMenu from './scanner/ScannerDropdownMenu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// dropdown menu lives in ./scanner/ScannerDropdownMenu
import { Scanner as QrScanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useState, useRef, useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

type ScannerProps = {
  onScan?: (code: string) => void;
  isLoading?: boolean;
};

export default function Scanner({ onScan, isLoading }: ScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      const win = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const AudioCtor = win.AudioContext ?? win.webkitAudioContext;
      if (!AudioCtor) {
        logger.error('No AudioContext available in this environment');
        return;
      }
      audioCtxRef.current = new AudioCtor();
    }
  };

  const playBeep = (duration = 120, freq = 1000, vol = 0.08) => {
    try {
      ensureAudio();
      const ctx = audioCtxRef.current!;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        try {
          o.stop();
        } catch (stopErr) {
          logger.error('Error stopping oscillator', stopErr);
        }
        try {
          o.disconnect();
        } catch (discErr) {
          logger.error('Error disconnecting oscillator', discErr);
        }
        try {
          g.disconnect();
        } catch (discErr) {
          logger.error('Error disconnecting gain node', discErr);
        }
      }, duration);
    } catch (err) {
      logger.error('Audio playback error in playBeep()', err);
    }
  };

  const refreshCamera = () => {
    // bumping the key will remount the QrScanner, causing it to re-request the camera
    setScannerKey((k) => k + 1);
  };

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0 && !isLoading) {
      const code = detectedCodes[0].rawValue;
      if (audioBeep) playBeep();
      onScan?.(code);
    }
  };

  const handleManualSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (manualCode.trim() && !isLoading) {
      onScan?.(manualCode.trim());
      setManualCode('');
    }
  };

  // Narrow local type to allow passing `torch` inside `advanced` without unsafe double-cast
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
              Item Verification
            </CardTitle>
            <CardDescription>Scan a barcode or enter the SKU below</CardDescription>
          </div>
          {isLoading && <div className="h-2 w-2 animate-ping rounded-full bg-primary" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scanner Feed Container */}
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

          {/* Functional Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Darkened corners for focus */}
            <div className="absolute inset-0 border-[3rem] border-black/40 sm:border-[4rem]" />

            {/* The "Finder" box */}
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-primary/50 sm:h-64 sm:w-64">
              {/* Corner markers */}
              <div className="absolute -left-1 -top-1 h-6 w-6 border-l-4 border-t-4 border-primary" />
              <div className="absolute -right-1 -top-1 h-6 w-6 border-r-4 border-t-4 border-primary" />
              <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-primary" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-primary" />

              {/* Scanning animation line */}
              <div className="absolute left-0 top-0 h-0.5 w-full bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-[scan_2s_ease-in-out_infinite]" />
            </div>

            {/* Device readiness indicators/hints */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-4 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              ALIGN BARCODE WITHIN THE SQUARE
            </div>
          </div>

          {/* Top-Left Controls */}
          <div className="absolute left-4 top-4">
            <ScannerDropdownMenu
              audioBeep={audioBeep}
              setAudioBeep={(v) => setAudioBeep(!!v)}
              refreshCamera={refreshCamera}
            />
          </div>

          {/* Top-Right Controls */}
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

        {/* Manual Fallback Entry */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="SKU or Barcode..."
              className="h-12 pr-10 text-lg font-medium tracking-wider"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              disabled={isLoading}
            />
            <Maximize className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40" />
          </div>
          <Button
            type="submit"
            size="lg"
            className="px-6 font-bold"
            disabled={isLoading || !manualCode.trim()}
          >
            Verify
          </Button>
        </form>

        <p className="mt-2 text-center text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          Walrhouse Verification System v1.0
        </p>
      </CardContent>
    </Card>
  );
}
