import { useState } from 'react';
import { LayoutGrid, History, ArrowRightCircle, FileText, type LucideIcon } from 'lucide-react';
import {
  InventorySidebar,
  type InventoryFeature,
} from '@/features/inventory/components/InventorySidebar';
import { BarcodeGenerator } from '@/features/inventory/components/BarcodeGenerator';
import { ItemsMasterList } from '@/features/inventory/components/ItemsMasterList';
import { UoMGroupManagement } from '@/features/receive/components/UoMGroupManagement';
import { Button } from '@/components/ui/button';
import CommonLayout from '@/layouts/CommonLayout';
import type { Roles as RoleType } from '@/features/auth/types/roles';
import { useAuth } from '@/features/auth/hooks/use-auth';

/**
 * InventoryPanel.tsx
 *
 * Purpose: Main entry point for the Inventory admin features.
 * Provides a dynamic layout with a vertical sidebar and changing main content.
 */

const InventoryPanel = () => {
  const { user } = useAuth();
  const roles = (user?.roles as RoleType[]) ?? [];
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
            <ItemsMasterList />
          </div>
        );
      case 'uom':
        return (
          <div className="space-y-6">
            <Header
              title="Unit of Measure Groups"
              description="Define conversion factors between different units."
            />
            <UoMGroupManagement />
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
    <CommonLayout roles={roles}>
      <div className="flex h-[calc(100vh-12rem)] w-full bg-background border rounded-lg overflow-hidden">
        {/* Sidebar Navigation */}
        <InventorySidebar activeFeature={activeFeature} onSelect={(f) => setActiveFeature(f)} />

        {/* Main Feature Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-muted/10">
          <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="opacity-60">Inventory</span>
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
    </CommonLayout>
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
