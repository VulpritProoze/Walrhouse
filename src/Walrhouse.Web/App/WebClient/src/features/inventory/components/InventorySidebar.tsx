import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Package,
  QrCode,
  ArrowLeftRight,
  RefreshCcw,
  History,
  Scale,
  List,
  type LucideIcon,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type InventoryFeature = 'items' | 'uom' | 'barcode' | 'movement' | 'replenishment' | 'audit';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  features?: InventoryFeature[];
  subItems?: { id: InventoryFeature; label: string; icon: LucideIcon }[];
}

interface InventorySidebarProps {
  activeFeature: InventoryFeature;
  onSelect: (feature: InventoryFeature) => void;
}

export const InventorySidebar = ({ activeFeature, onSelect }: InventorySidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'items-group',
      label: 'Items',
      icon: Package,
      features: ['items', 'uom'],
      subItems: [
        { id: 'items', label: 'Items Master List', icon: List },
        { id: 'uom', label: 'Unit of Measures', icon: Scale },
      ],
    },
    { id: 'barcode', label: 'Barcodes', icon: QrCode, features: ['barcode'] },
    { id: 'movement', label: 'Stock Movement', icon: ArrowLeftRight, features: ['movement'] },
    { id: 'replenishment', label: 'Replenishment', icon: RefreshCcw, features: ['replenishment'] },
    { id: 'audit', label: 'Audit & History', icon: History, features: ['audit'] },
  ];

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

      <div className="flex-1 py-4 space-y-2 px-2 overflow-y-auto">
        <TooltipProvider delay={0}>
          <Accordion className="w-full border-none space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isGroupActive = item.features?.includes(activeFeature);

              if (hasSubItems) {
                return (
                  <AccordionItem key={item.id} value={item.id} className="border-none">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <AccordionTrigger
                            className={cn(
                              'flex w-full items-center justify-between gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md',
                              isGroupActive && 'bg-secondary text-secondary-foreground',
                              collapsed && 'justify-center px-0',
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={20} className={cn(isGroupActive && 'text-primary')} />
                              {!collapsed && <span>{item.label}</span>}
                            </div>
                            {!collapsed && (
                              <ChevronDown
                                size={14}
                                className="text-muted-foreground transition-transform duration-200 group-data-open/accordion-trigger:rotate-180"
                              />
                            )}
                          </AccordionTrigger>
                        }
                      />
                      {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                    </Tooltip>
                    <AccordionContent className={cn('pb-1 pt-1', collapsed && 'hidden')}>
                      <div className="ml-4 space-y-1">
                        {item.subItems?.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = activeFeature === sub.id;
                          return (
                            <Button
                              key={sub.id}
                              variant={isSubActive ? 'secondary' : 'ghost'}
                              className="w-full justify-start gap-3 h-9 text-xs px-3"
                              onClick={() => onSelect(sub.id)}
                            >
                              <SubIcon size={16} />
                              <span>{sub.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger
                    render={
                      <Button
                        variant={activeFeature === item.id ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 h-10',
                          collapsed && 'justify-center px-0',
                        )}
                        onClick={() => onSelect(item.id as InventoryFeature)}
                      >
                        <Icon size={20} className={cn(isGroupActive && 'text-primary')} />
                        {!collapsed && <span>{item.label}</span>}
                      </Button>
                    }
                  />
                  {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              );
            })}
          </Accordion>
        </TooltipProvider>
      </div>
    </div>
  );
};
