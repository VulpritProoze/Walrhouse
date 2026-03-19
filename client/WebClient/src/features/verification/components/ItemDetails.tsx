import { CheckCircle2, Package, MapPin, Hash, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ItemDetailsProps = {
  /** Will be replaced with real data later */
  itemCode?: string;
  onConfirm?: () => void;
  onBack?: () => void;
};

export default function ItemDetails({ itemCode = 'WH-00123', onConfirm, onBack }: ItemDetailsProps) {
  // Placeholder item data — will come from API later
  const item = {
    sku: itemCode,
    name: 'Industrial Widget A',
    location: 'Aisle 3, Shelf B-12',
    quantity: 42,
    category: 'Hardware',
    lastVerified: '2026-03-18',
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-lg">Item Details</CardTitle>
            <CardDescription>Scanned: {item.sku}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">SKU</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              {item.sku}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Name</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Package className="h-3.5 w-3.5 text-muted-foreground" />
              {item.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Location</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {item.location}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Quantity</p>
            <p className="text-sm font-medium">{item.quantity} units</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Category</p>
            <p className="text-sm font-medium">{item.category}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Last Verified</p>
            <p className="text-sm font-medium">{item.lastVerified}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirm Verification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
