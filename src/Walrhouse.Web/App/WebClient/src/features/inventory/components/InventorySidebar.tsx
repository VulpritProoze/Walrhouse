import { motion } from 'framer-motion';
import {
  Package,
  QrCode,
  ArrowLeftRight,
  RefreshCcw,
  History,
  Scale,
  List,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
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
  collapsed?: boolean;
  onToggle?: () => void;
}

export const InventorySidebar = ({
  activeFeature,
  onSelect,
  collapsed = false,
  onToggle,
}: InventorySidebarProps) => {
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
        'flex flex-col h-full border-r bg-muted/30 transition-all duration-300 ease-in-out relative',
        collapsed ? 'w-[64px]' : 'w-[260px]',
      )}
    >
      <div className="flex items-center justify-between p-4 border-b h-[60px] overflow-hidden whitespace-nowrap">
        {!collapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold tracking-tight text-foreground"
          >
            Inventory
          </motion.h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'h-8 w-8 ml-auto text-muted-foreground hover:text-primary',
            collapsed && 'mx-auto',
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 space-y-2 px-2 overflow-y-auto overflow-x-hidden no-scrollbar">
        <TooltipProvider delay={0}>
          <Accordion className="w-full border-none space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isGroupActive = item.features?.includes(activeFeature);

              if (hasSubItems) {
                return (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-none"
                    disabled={collapsed}
                    onClick={() => {
                      if (collapsed && onToggle) {
                        onToggle();
                      }
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <AccordionTrigger
                            className={cn(
                              'group flex w-full items-center justify-between gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground rounded-md',
                              collapsed && '**:data-[slot=accordion-trigger-icon]:hidden',
                              isGroupActive && 'bg-accent/40 text-primary',
                              collapsed && 'justify-center px-0 h-10 cursor-default',
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon
                                size={20}
                                className={cn(
                                  'shrink-0 transition-colors',
                                  isGroupActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground group-hover:text-primary',
                                )}
                              />
                              {!collapsed && <span>{item.label}</span>}
                            </div>
                          </AccordionTrigger>
                        }
                      />
                      {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                    </Tooltip>
                    <AccordionContent className={cn('pb-1 pt-1', collapsed && 'hidden')}>
                      <div className="ml-4 pl-3 border-l space-y-1 mt-1">
                        {item.subItems?.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = activeFeature === sub.id;
                          return (
                            <Button
                              key={sub.id}
                              variant="ghost"
                              className={cn(
                                'w-full justify-start gap-3 h-9 text-xs px-3 transition-colors',
                                isSubActive
                                  ? 'bg-primary/10 text-primary font-semibold'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
                              )}
                              onClick={() => onSelect(sub.id)}
                            >
                              <SubIcon size={14} />
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
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 h-10 transition-colors',
                          activeFeature === item.id
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
                          collapsed && 'justify-center px-0',
                        )}
                        onClick={() => onSelect(item.id as InventoryFeature)}
                      >
                        <Icon
                          size={20}
                          className={cn(
                            'shrink-0',
                            activeFeature === item.id
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-primary',
                          )}
                        />
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
