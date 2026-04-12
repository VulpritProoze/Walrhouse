/**
 * WarehouseManagement component for the Admin Panel.
 * Handles warehouses, bins, and system-wide settings via a sidebar layout.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutPanelLeft,
  Settings,
  ShieldCheck,
  Layers,
  Warehouse,
  ChevronRight,
  ChevronLeft,
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
import { WarehouseView } from './warehouse-management/WarehouseView';
import { BinView } from './warehouse-management/BinView';
import { SettingsView } from './warehouse-management/SettingsView';

type ViewMode = 'warehouse' | 'bin' | 'settings';

export default function WarehouseManagement() {
  const [view, setView] = useState<ViewMode>('warehouse');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex gap-6 min-h-[600px] w-full">
      {/* Local Sidebar */}
      <div
        className={cn(
          'flex flex-col h-full border rounded-xl bg-muted/20 transition-all duration-300 ease-in-out relative overflow-hidden',
          collapsed ? 'w-[64px]' : 'w-[260px]',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b h-[60px] overflow-hidden whitespace-nowrap">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-bold tracking-tight text-foreground/70"
            >
              Infrastructure
            </motion.span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
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
              {/* Infrastructure Group */}
              <AccordionItem
                value="infra"
                className="border-none"
                disabled={collapsed}
                onClick={() => {
                  if (collapsed) setCollapsed(false);
                }}
              >
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <AccordionTrigger
                        className={cn(
                          'group flex w-full items-center justify-between gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground rounded-md',
                          collapsed && '**:data-[slot=accordion-trigger-icon]:hidden',
                          (view === 'warehouse' || view === 'bin') && 'bg-accent/40 text-primary',
                          collapsed && 'justify-center px-0 h-10 cursor-default',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <LayoutPanelLeft
                            size={18}
                            className={cn(
                              'shrink-0 transition-colors',
                              view === 'warehouse' || view === 'bin'
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-primary',
                            )}
                          />
                          {!collapsed && <span>Infrastucture</span>}
                        </div>
                      </AccordionTrigger>
                    }
                  />
                  {collapsed && <TooltipContent side="right">Infrastructure</TooltipContent>}
                </Tooltip>
                <AccordionContent className={cn('pb-1 pt-1', collapsed && 'hidden')}>
                  <div className="ml-4 pl-3 border-l space-y-1 mt-1">
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3 h-9 text-xs px-3 transition-colors',
                        view === 'warehouse'
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
                      )}
                      onClick={() => setView('warehouse')}
                    >
                      <Warehouse size={14} />
                      <span>Warehouses</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3 h-9 text-xs px-3 transition-colors',
                        view === 'bin'
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
                      )}
                      onClick={() => setView('bin')}
                    >
                      <Layers size={14} />
                      <span>Bins</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* System Group */}
              <AccordionItem
                value="system"
                className="border-none pt-2 mt-2 border-t border-sidebar-border/50"
                disabled={collapsed}
                onClick={() => {
                  if (collapsed) setCollapsed(false);
                }}
              >
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <AccordionTrigger
                        className={cn(
                          'group flex w-full items-center justify-between gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground rounded-md',
                          collapsed && '**:data-[slot=accordion-trigger-icon]:hidden',
                          view === 'settings' && 'bg-accent/40 text-primary',
                          collapsed && 'justify-center px-0 h-10 cursor-default',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck
                            size={18}
                            className={cn(
                              'shrink-0 transition-colors',
                              view === 'settings'
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-primary',
                            )}
                          />
                          {!collapsed && <span>System</span>}
                        </div>
                      </AccordionTrigger>
                    }
                  />
                  {collapsed && <TooltipContent side="right">System</TooltipContent>}
                </Tooltip>
                <AccordionContent className={cn('pb-1 pt-1', collapsed && 'hidden')}>
                  <div className="ml-4 pl-3 border-l space-y-1 mt-1">
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3 h-9 text-xs px-3 transition-colors',
                        view === 'settings'
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
                      )}
                      onClick={() => setView('settings')}
                    >
                      <Settings size={14} />
                      <span>UI Settings</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TooltipProvider>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden transition-all duration-300">
        {view === 'warehouse' && <WarehouseView />}
        {view === 'bin' && <BinView />}
        {view === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}
