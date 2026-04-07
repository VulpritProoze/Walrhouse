import { useState } from 'react';
import {
  Search,
  LayoutGrid,
  Layers,
  History,
  ArrowRightCircle,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import {
  InventorySidebar,
  type InventoryFeature,
} from '@/features/inventory/components/InventorySidebar';
import { BarcodeGenerator } from '@/features/inventory/components/BarcodeGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * InventoryPanel.tsx
 *
 * Purpose: Main entry point for the Inventory admin features.
 * Provides a dynamic layout with a vertical sidebar and changing main content.
 */

const InventoryPanel = () => {
  const [activeFeature, setActiveFeature] = useState<InventoryFeature>('items');

  // Placeholder views for other features
  const renderFeatureView = () => {
    switch (activeFeature) {
      case 'items':
        return (
          <div className="space-y-6">
            <Header
              title="Items Master List"
              description="Manage SKU, item attributes, and stock levels."
            />
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Search items by SKU, name, or barcode..."
                  className="pl-10 h-10 ring-offset-background border-none shadow-sm bg-white"
                />
              </div>
            </div>
            <div className="border border-dashed border-muted rounded-xl p-12 bg-muted/5 flex flex-col items-center justify-center text-center">
              <Layers size={48} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
              <p className="text-muted-foreground font-medium">
                Items Master CRUD list will be implemented here.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1 max-w-sm">
                Use the table layout to create, edit, or delete items within the system.
              </p>
            </div>
          </div>
        );
      case 'barcode':
        return (
          <div className="space-y-6">
            <Header
              title="Barcodes"
              description="Configure and generate item/bin barcodes for scanner usage."
            />
            <BarcodeGenerator />
          </div>
        );
      case 'movement':
        return (
          <PlaceholderView
            title="Stock Movement"
            description="Record internal transfers, putaway, and adjustments."
            icon={ArrowRightCircle}
          />
        );
      case 'replenishment':
        return (
          <PlaceholderView
            title="Replenishment"
            description="Monitor reorder points and trigger suggestions."
            icon={LayoutGrid}
          />
        );
      case 'audit':
        return (
          <PlaceholderView
            title="Audit & History"
            description="Generate reports and track historical actions."
            icon={History}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden">
      {/* Sidebar Navigation */}
      <InventorySidebar activeFeature={activeFeature} onSelect={(f) => setActiveFeature(f)} />

      {/* Main Feature Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="opacity-60">Admin</span>
            <span className="opacity-40">/</span>
            <span className="font-medium text-primary capitalize">
              {activeFeature.replace('-', ' ')}
            </span>
          </div>

          <div
            key={activeFeature}
            className="animate-in fade-in slide-in-from-right-2 duration-300"
          >
            {renderFeatureView()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Scaffolding Components
const Header = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-1 mb-8">
    <h1 className="font-black tracking-tighter text-3xl font-sans text-foreground">{title}</h1>
    <p className="text-sm text-muted-foreground/80 font-medium">{description}</p>
  </div>
);

const PlaceholderView = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) => (
  <div className="space-y-6">
    <Header title={title} description={description} />
    <div className="border border-dashed border-muted rounded-xl p-24 bg-muted/5 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-6 rounded-full bg-white shadow-sm ring-1 ring-muted">
        <Icon size={48} className="text-primary/40" strokeWidth={1} />
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground font-semibold text-lg">{title} view coming soon</h3>
        <p className="text-sm text-muted-foreground/60 max-w-md mx-auto">
          This feature is scheduled for development. It will follow the {title.toLowerCase()}{' '}
          operational workflow defined in DESIGN.md.
        </p>
      </div>
      <Button variant="outline" className="gap-2 text-xs h-8">
        <FileText size={14} />
        View Design Specs
      </Button>
    </div>
  </div>
);

export default InventoryPanel;
