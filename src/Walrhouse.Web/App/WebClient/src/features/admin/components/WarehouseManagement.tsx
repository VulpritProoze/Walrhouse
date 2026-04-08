/**
 * WarehouseManagement component for the Admin Panel.
 * Handles warehouses, bins, and system-wide settings via a sidebar layout.
 */
import { useState } from 'react';
import {
  LayoutPanelLeft,
  Settings,
  ShieldCheck,
  Layers,
  Warehouse,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WarehouseView } from './warehouse-management/WarehouseView';
import { BinView } from './warehouse-management/BinView';
import { SettingsView } from './warehouse-management/SettingsView';

type ViewMode = 'warehouse' | 'bin' | 'settings';

export default function WarehouseManagement() {
  const [view, setView] = useState<ViewMode>('warehouse');

  return (
    <SidebarProvider>
      <div className="flex gap-6 min-h-[600px] w-full">
        {/* Local Sidebar */}
        <Sidebar
          variant="floating"
          collapsible="none"
          className="static h-auto border-none shadow-sm bg-muted/20 rounded-xl overflow-hidden"
        >
          <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <div className="px-2 mb-2">
                  <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 py-1.5 rounded-md w-full flex items-center justify-between transition-all text-sm font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden focus-visible:ring-2 [&[data-panel-open]>svg:last-child]:rotate-90">
                    <div className="flex items-center gap-2">
                      <LayoutPanelLeft className="h-4 w-4" />
                      Infrastructure
                    </div>
                    <ChevronRight className="h-3 w-3 transition-transform duration-200" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenuSub className="ml-0 border-l px-0">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={view === 'warehouse'}
                          onClick={() => setView('warehouse')}
                          className="pl-6 border-l-2 border-transparent data-active:border-primary rounded-none"
                        >
                          <Warehouse className="h-4 w-4" />
                          <span>Warehouses</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={view === 'bin'}
                          onClick={() => setView('bin')}
                          className="pl-6 border-l-2 border-transparent data-active:border-primary rounded-none"
                        >
                          <Layers className="h-4 w-4" />
                          <span>Bins</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup className="mt-2 pt-2 border-t border-sidebar-border/50">
                <div className="px-2 mb-2">
                  <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 py-1.5 rounded-md w-full flex items-center justify-between transition-all text-sm font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden focus-visible:ring-2 [&[data-panel-open]>svg:last-child]:rotate-90">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      System
                    </div>
                    <ChevronRight className="h-3 w-3 transition-transform duration-200" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenuSub className="ml-0 border-l px-0">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={view === 'settings'}
                          onClick={() => setView('settings')}
                          className="pl-6 border-l-2 border-transparent data-active:border-primary rounded-none"
                        >
                          <Settings className="h-4 w-4" />
                          <span>UI Settings</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {view === 'warehouse' && <WarehouseView />}
          {view === 'bin' && <BinView />}
          {view === 'settings' && <SettingsView />}
        </div>
      </div>
    </SidebarProvider>
  );
}
