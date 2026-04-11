import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  QrCode,
  Scan,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  Search,
  Download,
} from 'lucide-react';
import { BatchSelectionSheet } from './barcode-generation/BatchSelectionSheet';
import { getBarcodeImageUrl } from '@/features/barcode/api/barcode.service';
import { cn } from '@/lib/utils';

export const BarcodeGenerator = () => {
  const [formData, setFormData] = useState({
    batchNumber: '',
  });

  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleGenerate = () => {
    if (formData.batchNumber) {
      setBarcodeUrl(getBarcodeImageUrl(formData.batchNumber));
    }
  };

  const handleDownload = async () => {
    if (!barcodeUrl) return;
    try {
      const response = await fetch(barcodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `barcode-${formData.batchNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download barcode', err);
    }
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex-1 p-6 overflow-y-auto">
        <Card className="shadow-sm border-accent/20 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <QrCode className="text-primary h-5 w-5" />
              Barcode Generation
            </CardTitle>
            <CardDescription>
              Enter the batch number to generate a unique identifier.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Batch Number</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-between"
                  onClick={() => setSheetOpen(true)}
                >
                  <span className="truncate">{formData.batchNumber || 'Select batch...'}</span>
                  <Search className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFormData({ batchNumber: '' });
                    setBarcodeUrl(null);
                  }}
                  title="Clear"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="w-full flex gap-2"
                onClick={handleGenerate}
                disabled={!formData.batchNumber}
              >
                <Smartphone size={16} />
                Generate & Assign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BatchSelectionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSelect={(b) => {
          setFormData({ batchNumber: b });
          setBarcodeUrl(null);
        }}
      />

      {/* Collapsible Sidebar */}
      <div
        className={cn(
          'relative border-l bg-muted/5 transition-all duration-300 ease-in-out flex flex-col',
          isPreviewOpen ? 'w-[400px]' : 'w-12',
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-4 top-4 z-10 h-8 w-8 rounded-full border bg-background shadow-md"
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
        >
          {isPreviewOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>

        <div
          className={cn(
            'flex-1 flex flex-col h-full overflow-hidden transition-opacity duration-200',
            !isPreviewOpen && 'opacity-0 pointer-events-none',
          )}
        >
          <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
            <h3 className="font-semibold flex items-center gap-2">
              <Scan size={18} className="text-primary" />
              Preview
            </h3>
            <p className="text-xs text-muted-foreground">
              Generated barcode data and visualization.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/5 relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 opacity-5 pointer-events-none">
              <Scan className="h-48 w-48 text-primary" />
            </div>

            {barcodeUrl ? (
              <div className="flex flex-col items-center gap-4 text-center p-6 bg-white rounded-lg shadow-md border animate-in zoom-in-95 duration-200 w-full max-w-xs z-10">
                <div className="p-4 bg-muted/20 rounded-md flex items-center justify-center overflow-hidden border">
                  <img
                    src={barcodeUrl}
                    alt={`Barcode for ${formData.batchNumber}`}
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                    Batch Identifier
                  </span>
                  <div className="font-mono text-xl font-bold tracking-tighter break-all">
                    {formData.batchNumber}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-primary border-primary/20 hover:bg-primary/5 w-full gap-2"
                  onClick={handleDownload}
                >
                  <Download size={14} /> Download PNG
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground/60 transition-transform duration-300 group-hover:scale-105 z-10">
                <Smartphone size={48} strokeWidth={1} />
                <p className="text-sm font-medium text-center px-4">
                  Input batch details to generate barcode
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
