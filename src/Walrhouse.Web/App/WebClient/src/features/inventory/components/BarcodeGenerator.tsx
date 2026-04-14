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
  Package,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import { BatchSelectionSheet } from './barcode-generation/BatchSelectionSheet';
import { OrderSelectionSheet } from './barcode-generation/OrderSelectionSheet';
import { getBarcodeImageUrl } from '@/features/barcode/api/barcode.service';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBatchBarcodeValue } from '@/features/batch/util/barcode';
import { getSalesOrderBarcodeValue } from '@/features/sales-order/util/barcode';

export const BarcodeGenerator = () => {
  const [type, setType] = useState<'batch' | 'order'>('batch');
  const [formData, setFormData] = useState({
    batchNumber: '',
    orderId: null as number | null,
  });

  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [batchSheetOpen, setBatchSheetOpen] = useState(false);
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);

  const getIdentifier = () => {
    if (type === 'batch') return getBatchBarcodeValue(formData.batchNumber);
    return formData.orderId ? getSalesOrderBarcodeValue(formData.orderId) : '';
  };

  const handleGenerate = () => {
    const identifier = getIdentifier();
    if (identifier) {
      setBarcodeUrl(getBarcodeImageUrl(identifier));
      setIsPreviewOpen(true);
    }
  };

  const handleDownload = async () => {
    const identifier = getIdentifier();
    if (!barcodeUrl || !identifier) return;
    try {
      const response = await fetch(barcodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `barcode-${identifier}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download barcode', err);
    }
  };

  const identifier = getIdentifier();

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
              Select a batch or sales order to generate a unique barcode identifier.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={type}
              onValueChange={(v) => {
                setType(v as 'batch' | 'order');
                setBarcodeUrl(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
                <TabsTrigger
                  value="batch"
                  className="gap-2 py-2 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  <Package className="h-4 w-4 shrink-0" />
                  <span className="truncate">Batch</span>
                </TabsTrigger>
                <TabsTrigger
                  value="order"
                  className="gap-2 py-2 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  <Receipt className="h-4 w-4 shrink-0" />
                  <span className="truncate">Sales Order</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <Label>{type === 'batch' ? 'Batch Number' : 'Sales Order'}</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-between font-normal"
                  onClick={() =>
                    type === 'batch' ? setBatchSheetOpen(true) : setOrderSheetOpen(true)
                  }
                >
                  <span className="truncate">
                    {type === 'batch'
                      ? formData.batchNumber || 'Select batch...'
                      : formData.orderId
                        ? `Order #${formData.orderId}`
                        : 'Select sales order...'}
                  </span>
                  <Search className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
                {(formData.batchNumber || formData.orderId) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFormData({ batchNumber: '', orderId: null });
                      setBarcodeUrl(null);
                    }}
                    title="Clear"
                  >
                    ✕
                  </Button>
                )}
              </div>
              {identifier && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-md border border-primary/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-mono text-primary font-medium">
                    Final Identifier: {identifier}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button className="w-full flex gap-2" onClick={handleGenerate} disabled={!identifier}>
                <Smartphone size={16} />
                Generate Barcode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BatchSelectionSheet
        open={batchSheetOpen}
        onOpenChange={setBatchSheetOpen}
        onSelect={(b) => {
          setFormData((prev) => ({ ...prev, batchNumber: b }));
          setBarcodeUrl(null);
        }}
      />

      <OrderSelectionSheet
        open={orderSheetOpen}
        onOpenChange={setOrderSheetOpen}
        selectedId={formData.orderId}
        onSelect={(order) => {
          setFormData((prev) => ({ ...prev, orderId: order.id }));
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
                    alt={`Barcode for ${identifier}`}
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                    {type === 'batch' ? 'Batch Identifier' : 'Order Identifier'}
                  </span>
                  <div className="font-mono text-xl font-bold tracking-tighter break-all">
                    {identifier}
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
                  Select {type === 'batch' ? 'batch' : 'order'} and click generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
