import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Scan, Smartphone } from 'lucide-react';

export const BarcodeGenerator = () => {
  const [formData, setFormData] = useState({
    itemCode: '',
    bin: '',
    expiryDate: '',
  });

  const [generatedBarcode, setGeneratedBarcode] = useState<string | null>(null);

  const handleGenerate = () => {
    // Scaffold: Generate a placeholder barcode based on input
    const barcodeValue = `${formData.itemCode}-${formData.bin}-${formData.expiryDate}`;
    setGeneratedBarcode(barcodeValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <Card className="md:col-span-1 shadow-sm border-accent/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <QrCode className="text-primary h-5 w-5" />
            Barcode Generation
          </CardTitle>
          <CardDescription>Assign unique identifiers to items and bins.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemCode">Item Code</Label>
            <Input
              id="itemCode"
              placeholder="e.g. SKU-123456"
              value={formData.itemCode}
              onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bin">Bin Location</Label>
            <Input
              id="bin"
              placeholder="e.g. A3-B1-05"
              value={formData.bin}
              onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>
          <div className="pt-2">
            <Button
              className="w-full flex gap-2"
              onClick={handleGenerate}
              disabled={!formData.itemCode}
            >
              <Smartphone size={16} />
              Generate & Assign
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none">
          <Scan className="h-48 w-48 text-primary/10" />
        </div>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Generated barcode data and visualization.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[260px] border-2 border-dashed border-muted rounded-md bg-muted/5">
          {generatedBarcode ? (
            <div className="flex flex-col items-center gap-4 text-center p-6 bg-white rounded-lg shadow-md border animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-muted/20 rounded flex items-center justify-center">
                <QrCode size={128} className="text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                  Unique Identifier
                </span>
                <div className="font-mono text-xl font-bold tracking-tighter">
                  {formData.itemCode}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground justify-center">
                  <span>BIN: {formData.bin || '---'}</span>
                  <span>•</span>
                  <span>EXP: {formData.expiryDate || 'PERPETUAL'}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-primary border-primary/20 hover:bg-primary/5"
              >
                Download SVG
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground/60 transition-transform duration-300 group-hover:scale-105">
              <Smartphone size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Input item details to generate barcode</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
