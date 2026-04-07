import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Package,
  QrCode,
  ArrowLeftRight,
  RefreshCcw,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type InventoryFeature = 'items' | 'barcode' | 'movement' | 'replenishment' | 'audit';

interface InventorySidebarProps {
  activeFeature: InventoryFeature;
  onSelect: (feature: InventoryFeature) => void;
}

export const InventorySidebar = ({ activeFeature, onSelect }: InventorySidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'items', label: 'Items Master', icon: Package },
    { id: 'barcode', label: 'Barcodes', icon: QrCode },
    { id: 'movement', label: 'Stock Movement', icon: ArrowLeftRight },
    { id: 'replenishment', label: 'Replenishment', icon: RefreshCcw },
    { id: 'audit', label: 'Audit & History', icon: History },
  ] as const;

  return (
    <div
      className={cn(
        'flex flex-col h-full border-r bg-muted/30 transition-all duration-300',
        collapsed ? 'w-[60px]' : 'w-[240px]',
      )}
    >
      <div className="flex items-center justify-between p-4 border-b h-[60px]">
        {!collapsed && <h2 className="text-lg font-bold tracking-tight">Inventory</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto h-8 w-8"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 space-y-2 px-2">
        <TooltipProvider delay={0}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFeature === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger
                  render={
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 h-10',
                        collapsed && 'justify-center px-0',
                      )}
                      onClick={() => onSelect(item.id)}
                    >
                      <Icon size={20} className={cn(isActive && 'text-primary')} />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  }
                />
                {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};
