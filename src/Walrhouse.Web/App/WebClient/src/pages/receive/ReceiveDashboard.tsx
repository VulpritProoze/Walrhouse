import { useState } from 'react';
import { Settings2, FileText, type LucideIcon } from 'lucide-react';
import { ReceiveSidebar, type ReceiveFeature } from '@/features/receive/components/ReceiveSidebar';
import { ReceivingView } from '@/features/receive/components/ReceivingView';
import { BatchMasterList } from '@/features/receive/components/BatchMasterList';
import { IncomingOrdersView } from '@/features/receive/components/incoming-orders/IncomingOrdersView';
import { Button } from '@/components/ui/button';
import CommonLayout from '@/layouts/CommonLayout';
import type { Roles as RoleType } from '@/features/auth/types/roles';
import { useAuth } from '@/features/auth/hooks/use-auth';

/**
 * ReceiveDashboard.tsx
 *
 * Purpose: Main entry point for the Receiving operations.
 * Provides a dynamic layout with a vertical sidebar and changing main content.
 */

const ReceiveDashboard = () => {
  const { user } = useAuth();
  const roles = (user?.roles as RoleType[]) ?? [];
  const [activeFeature, setActiveFeature] = useState<ReceiveFeature>('receiving');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderFeatureView = () => {
    switch (activeFeature) {
      case 'receiving':
        return (
          <div className="space-y-6">
            <Header
              title="Receiving Worklist"
              description="Manage incoming goods, verification, and initial staging."
            />
            <ReceivingView />
          </div>
        );
      case 'incoming-orders':
        return (
          <div className="space-y-6">
            <Header
              title="Incoming Orders"
              description="Manage sales orders and pre-registered shipments for receipt."
            />
            <IncomingOrdersView />
          </div>
        );
      case 'batches':
        return (
          <div className="space-y-6">
            <Header
              title="Batch Master List"
              description="Review and track batch history, items, and verification states."
            />
            <BatchMasterList />
          </div>
        );
      case 'settings':
        return (
          <PlaceholderView
            title="Receiving Settings"
            description="Adjust printers, default locations, and auto-verification thresholds."
            icon={Settings2}
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
        <ReceiveSidebar
          activeFeature={activeFeature}
          onSelect={(f) => setActiveFeature(f)}
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Feature Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-muted/10">
          <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="opacity-60">Operations</span>
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
          This feature is scheduled for development according to receiving operational requirements.
        </p>
      </div>
      <Button variant="outline" className="gap-2 text-xs h-8">
        <FileText size={14} />
        View Setup Docs
      </Button>
    </div>
  </div>
);

export default ReceiveDashboard;
